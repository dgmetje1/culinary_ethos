import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import type { UserAttributes } from "../social/domain/models";

export interface UserProfileResponse {
  id: string;
  accountId: string;
  nickName: string;
  name: string;
  lastName: string;
  email: string;
  language: string;
  profilePicture: string | null;
  description: string | null;
  position: string | null;
  location: string | null;
  role: string;
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get("login")
  @ApiOperation({ summary: "Initiate Auth0 login flow" })
  @UseGuards(AuthGuard("auth0"))
  login(): void {}

  @Public()
  @Get("callback")
  @ApiOperation({ summary: "Auth0 callback handler" })
  @UseGuards(AuthGuard("auth0"))
  async callback(@Req() _req: Request, @Res() res: Response): Promise<void> {
    res.redirect(HttpStatus.FOUND, this.configService.get("FRONTEND_URL", "http://localhost:5173"));
  }

  @ApiBearerAuth()
  @Get("profile")
  @ApiOperation({ summary: "Get current user profile" })
  async getProfile(@CurrentUser() user: UserAttributes | null): Promise<UserProfileResponse> {
    if (!user) {
      throw new NotFoundException("User not found. Please sign up first.");
    }
    return {
      id: user.id,
      accountId: user.account_id,
      nickName: user.nick_name,
      name: user.name,
      lastName: user.last_name,
      email: user.email,
      language: user.language,
      profilePicture: user.profile_picture,
      description: user.description,
      position: user.position,
      location: user.location,
      role: user.role,
    };
  }

  @ApiBearerAuth()
  @Get("logout")
  @ApiOperation({ summary: "Logout user" })
  async logout(@Res() res: Response): Promise<void> {
    const domain = this.configService.getOrThrow("AUTH0_DOMAIN");
    const clientId = this.configService.getOrThrow("AUTH0_CLIENT_ID");
    const returnTo = this.configService.get("FRONTEND_URL", "http://localhost:5173");
    res.redirect(
      HttpStatus.FOUND,
      `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`,
    );
  }
}

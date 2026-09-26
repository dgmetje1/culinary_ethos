import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-auth0";
import type { Profile } from "passport-auth0";
import type { ExtraVerificationParams } from "passport-auth0";
import { AuthService, Auth0Profile } from "../auth.service";

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, "auth0") {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      domain: configService.getOrThrow("AUTH0_DOMAIN"),
      clientID: configService.getOrThrow("AUTH0_CLIENT_ID"),
      clientSecret: configService.getOrThrow("AUTH0_CLIENT_SECRET"),
      callbackURL: configService.getOrThrow("AUTH0_CALLBACK_URL"),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    _extraParams: ExtraVerificationParams,
    profile: Profile,
  ): Promise<any> {
    const auth0Profile: Auth0Profile = {
      id: profile.id,
      displayName: profile.displayName,
      name: (profile as any).name,
      emails: (profile as any).emails,
      photos: (profile as any).photos,
      nickname: (profile as any).nickname,
    };
    return this.authService.findOrCreateUser(auth0Profile);
  }
}

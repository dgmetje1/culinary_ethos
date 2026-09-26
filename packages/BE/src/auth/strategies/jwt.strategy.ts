import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { Request } from "express";
import { AuthService } from "../auth.service";
import type { JwtPayload } from "../auth.service";
import type { UserAttributes } from "../../social/domain/models";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const domain = configService.getOrThrow("AUTH0_DOMAIN");

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.getOrThrow("AUTH0_AUDIENCE"),
      issuer: `https://${domain}/`,
      algorithms: ["RS256"],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<UserAttributes | null> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return this.authService.validateJwt(payload, token ?? undefined);
  }
}

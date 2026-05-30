import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { USER_REPOSITORY } from '../social/application/repositories/i-user.repository';
import type { IUserRepository } from '../social/application/repositories/i-user.repository';
import type { UserAttributes } from '../social/domain/models';

export interface Auth0Profile {
  id: string;
  displayName?: string;
  name?: { givenName?: string; familyName?: string };
  emails?: { value: string }[];
  photos?: { value: string }[];
  nickname?: string;
}

export interface JwtPayload {
  sub: string;
  email?: string;
}

interface UserinfoResponse {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  nickname?: string;
  picture?: string;
  email?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async findOrCreateUser(profile: Auth0Profile): Promise<UserAttributes> {
    const accountId = profile.id;
    let user = await this.userRepository.findByAccountId(accountId);

    if (!user) {
      const email = profile.emails?.[0]?.value ?? '';
      const givenName = profile.name?.givenName ?? '';
      const familyName = profile.name?.familyName ?? '';
      const displayName = profile.displayName ?? email.split('@')[0];
      const picture = profile.photos?.[0]?.value ?? null;

      user = await this.userRepository.create({
        account_id: accountId,
        nick_name: profile.nickname ?? displayName,
        name: givenName || displayName,
        last_name: familyName,
        email,
        language: 'en',
        profile_picture: picture ?? undefined,
      });

      this.logger.log(`Created new user: ${user.id} (${email})`);
    }

    return user;
  }

  private async fetchUserinfo(accessToken: string): Promise<UserinfoResponse> {
    const domain = this.configService.getOrThrow('AUTH0_DOMAIN');
    const response = await fetch(`https://${domain}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new UnauthorizedException('Failed to fetch user info from Auth0');
    }
    return response.json();
  }

  private mapUserinfoToAuth0Profile(info: UserinfoResponse): Auth0Profile {
    return {
      id: info.sub,
      displayName: info.name,
      name: {
        givenName: info.given_name,
        familyName: info.family_name,
      },
      emails: info.email ? [{ value: info.email }] : [],
      photos: info.picture ? [{ value: info.picture }] : [],
      nickname: info.nickname,
    };
  }

  async validateJwt(
    payload: JwtPayload,
    accessToken?: string,
  ): Promise<UserAttributes | null> {
    const existing = await this.userRepository.findByAccountId(payload.sub);
    if (existing) return existing;

    if (!accessToken) return null;

    try {
      const userinfo = await this.fetchUserinfo(accessToken);
      const profile = this.mapUserinfoToAuth0Profile(userinfo);
      return this.findOrCreateUser(profile);
    } catch {
      return null;
    }
  }
}

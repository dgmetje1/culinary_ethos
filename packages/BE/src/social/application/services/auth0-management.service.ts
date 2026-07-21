import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../../../files/files.service';

interface ManagementTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class Auth0ManagementService {
  private readonly logger = new Logger(Auth0ManagementService.name);
  private cachedToken: { token: string; expiresAt: number } | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {}

  private getDomain(): string {
    return this.configService.getOrThrow('AUTH0_MANAGEMENT_DOMAIN');
  }

  private getClientId(): string | undefined {
    return this.configService.get<string>('AUTH0_MANAGEMENT_CLIENT_ID');
  }

  private getClientSecret(): string | undefined {
    return this.configService.get<string>('AUTH0_MANAGEMENT_CLIENT_SECRET');
  }

  private isConfigured(): boolean {
    return !!(this.getClientId() && this.getClientSecret());
  }

  private async getAccessToken(): Promise<string | null> {
    if (!this.isConfigured()) {
      this.logger.warn('Auth0 Management API not configured — skipping');
      return null;
    }

    if (this.cachedToken && Date.now() < this.cachedToken.expiresAt) {
      return this.cachedToken.token;
    }

    const domain = this.getDomain();
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.getClientId()!,
      client_secret: this.getClientSecret()!,
      audience: `https://${domain}/api/v2/`,
    });

    try {
      const response = await fetch(`https://${domain}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (!response.ok) {
        this.logger.error(
          `Failed to get Management API token: ${response.status}`,
        );
        return null;
      }

      const data: ManagementTokenResponse = await response.json();
      this.cachedToken = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in - 60) * 1000,
      };
      return data.access_token;
    } catch (error) {
      this.logger.error('Failed to get Management API token', error);
      return null;
    }
  }

  private async resolvePictureAsDataUrl(picture: string): Promise<string> {
    if (/^https?:\/\//i.test(picture)) return picture;
    if (picture.startsWith('data:')) return picture;

    const file = await this.filesService.downloadFile(picture);
    if (!file) return picture;

    const base64 = file.buffer.toString('base64');
    return `data:${file.contentType};base64,${base64}`;
  }

  async updateUser(
    accountId: string,
    changes: { nickname?: string; picture?: string },
  ): Promise<void> {
    const token = await this.getAccessToken();
    if (!token) return;

    const domain = this.getDomain();
    const body: Record<string, string> = {};
    if (changes.nickname !== undefined) body.nickname = changes.nickname;
    if (changes.picture !== undefined)
      body.picture = await this.resolvePictureAsDataUrl(changes.picture);

    if (Object.keys(body).length === 0) return;

    console.log('Updating Auth0 user with data:', body);

    try {
      const response = await fetch(
        `https://${domain}/api/v2/users/${encodeURIComponent(accountId)}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `Failed to update Auth0 user ${accountId}: ${response.status} ${errorText}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to update Auth0 user ${accountId}`, error);
    }
  }
}

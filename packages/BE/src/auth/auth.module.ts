import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SocialModule } from '../social/social.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth0Strategy } from './strategies/auth0.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    SocialModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Auth0Strategy, JwtStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}

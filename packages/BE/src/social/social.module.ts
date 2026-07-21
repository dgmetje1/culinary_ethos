import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/models';
import { UserRepository } from './infrastructure/repositories';
import {
  UserQueriesService,
  Auth0ManagementService,
} from './application/services';
import { Auth0UserUpdateListener } from './application/events/auth0-user-update.listener';
import { UsersController } from './interfaces/controllers';
import { USER_REPOSITORY } from './application/repositories/i-user.repository';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FilesModule],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    UserQueriesService,
    Auth0ManagementService,
    Auth0UserUpdateListener,
  ],
  exports: [UserQueriesService, USER_REPOSITORY],
})
export class SocialModule {}

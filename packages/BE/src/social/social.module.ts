import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/models';
import { UserRepository } from './infrastructure/repositories';
import { UserQueriesService } from './application/services';
import { UsersController } from './interfaces/controllers';
import { USER_REPOSITORY } from './application/repositories/i-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    UserQueriesService,
  ],
  exports: [UserQueriesService],
})
export class SocialModule {}
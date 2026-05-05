import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/models';
import { UserRepository } from './infrastructure/repositories';
import { UserQueriesService } from './application/services';
import { UsersController } from './interfaces/controllers';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserRepository, UserQueriesService],
  exports: [UserQueriesService],
})
export class SocialModule {}
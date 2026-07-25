import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, SavedRecipe, Follow } from './domain/models';
import { UserRepository, SavedRecipeRepository, FollowRepository } from './infrastructure/repositories';
import {
  UserQueriesService,
  Auth0ManagementService,
  SavedRecipesService,
  FollowsService,
} from './application/services';
import { Auth0UserUpdateListener } from './application/events/auth0-user-update.listener';
import { UsersController, SavedRecipesController, FollowsController } from './interfaces/controllers';
import { USER_REPOSITORY } from './application/repositories/i-user.repository';
import { SAVED_RECIPE_REPOSITORY } from './application/repositories/i-saved-recipe.repository';
import { FOLLOW_REPOSITORY } from './application/repositories/i-follow.repository';
import { ContentModule } from '../content/content.module';
import { RECIPE_REPOSITORY } from '../content/application/repositories/recipe.repository';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, SavedRecipe, Follow]), ContentModule, FilesModule],
  controllers: [UsersController, SavedRecipesController, FollowsController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: SAVED_RECIPE_REPOSITORY,
      useClass: SavedRecipeRepository,
    },
    {
      provide: FOLLOW_REPOSITORY,
      useClass: FollowRepository,
    },
    UserQueriesService,
    Auth0ManagementService,
    Auth0UserUpdateListener,
    SavedRecipesService,
    FollowsService,
  ],
  exports: [UserQueriesService, USER_REPOSITORY, SavedRecipesService, SAVED_RECIPE_REPOSITORY],
})
export class SocialModule {}

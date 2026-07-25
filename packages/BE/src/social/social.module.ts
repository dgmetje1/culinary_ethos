import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, SavedRecipe } from './domain/models';
import { UserRepository, SavedRecipeRepository } from './infrastructure/repositories';
import {
  UserQueriesService,
  Auth0ManagementService,
  SavedRecipesService,
} from './application/services';
import { Auth0UserUpdateListener } from './application/events/auth0-user-update.listener';
import { UsersController, SavedRecipesController } from './interfaces/controllers';
import { USER_REPOSITORY } from './application/repositories/i-user.repository';
import { SAVED_RECIPE_REPOSITORY } from './application/repositories/i-saved-recipe.repository';
import { ContentModule } from '../content/content.module';
import { RECIPE_REPOSITORY } from '../content/application/repositories/recipe.repository';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, SavedRecipe]), ContentModule, FilesModule],
  controllers: [UsersController, SavedRecipesController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: SAVED_RECIPE_REPOSITORY,
      useClass: SavedRecipeRepository,
    },
    UserQueriesService,
    Auth0ManagementService,
    Auth0UserUpdateListener,
    SavedRecipesService,
  ],
  exports: [UserQueriesService, USER_REPOSITORY, SavedRecipesService, SAVED_RECIPE_REPOSITORY],
})
export class SocialModule {}

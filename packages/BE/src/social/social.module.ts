import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, SavedRecipe, Follow, Notification } from "./domain/models";
import {
  UserRepository,
  SavedRecipeRepository,
  FollowRepository,
  NotificationRepository,
} from "./infrastructure/repositories";
import {
  UserQueriesService,
  Auth0ManagementService,
  SavedRecipesService,
  FollowsService,
  NotificationsService,
} from "./application/services";
import { Auth0UserUpdateListener } from "./application/events/auth0-user-update.listener";
import { NotificationListener } from "./application/events/notification.listener";
import {
  UsersController,
  SavedRecipesController,
  FollowsController,
  NotificationsController,
} from "./interfaces/controllers";
import { USER_REPOSITORY } from "./application/repositories/i-user.repository";
import { SAVED_RECIPE_REPOSITORY } from "./application/repositories/i-saved-recipe.repository";
import { FOLLOW_REPOSITORY } from "./application/repositories/i-follow.repository";
import { NOTIFICATION_REPOSITORY } from "./application/repositories/i-notification.repository";
import { ContentModule } from "../content/content.module";
import { FilesModule } from "../files/files.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SavedRecipe, Follow, Notification]),
    ContentModule,
    FilesModule,
  ],
  controllers: [
    UsersController,
    SavedRecipesController,
    FollowsController,
    NotificationsController,
  ],
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
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationRepository,
    },
    UserQueriesService,
    Auth0ManagementService,
    Auth0UserUpdateListener,
    NotificationListener,
    SavedRecipesService,
    FollowsService,
    NotificationsService,
  ],
  exports: [UserQueriesService, USER_REPOSITORY, SavedRecipesService, SAVED_RECIPE_REPOSITORY],
})
export class SocialModule {}

import { Injectable, Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
  NOTIFICATION_REPOSITORY,
  INotificationRepository,
} from "../repositories/i-notification.repository";
import { FOLLOW_REPOSITORY, IFollowRepository } from "../repositories/i-follow.repository";

@Injectable()
export class NotificationListener {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
    @Inject(FOLLOW_REPOSITORY)
    private readonly followRepository: IFollowRepository,
  ) {}

  @OnEvent("follow.created")
  async handleFollowCreated(payload: {
    followerId: string;
    followingId: string;
    followId: string;
    followerName?: string;
  }) {
    await this.notificationRepository.create({
      userId: payload.followingId,
      type: "follow",
      actorId: payload.followerId,
      actorName: payload.followerName || "Someone",
    });
  }

  @OnEvent("recipe.created")
  async handleRecipeCreated(payload: {
    recipeId: string;
    recipeTitle: string;
    authorId: string;
    authorName?: string;
  }) {
    const followers = await this.followRepository.findByFollowing(payload.authorId);

    for (const follow of followers) {
      await this.notificationRepository.create({
        userId: follow.followerId,
        type: "new_recipe",
        actorId: payload.authorId,
        actorName: payload.authorName || "Someone",
        recipeId: payload.recipeId,
        recipeTitle: payload.recipeTitle,
      });
    }
  }
}

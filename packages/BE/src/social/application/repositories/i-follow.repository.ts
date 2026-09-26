import { FollowAttributes } from "../../domain/models/follow.entity";

export const FOLLOW_REPOSITORY = "FOLLOW_REPOSITORY";

export interface IFollowRepository {
  findByFollower(followerId: string): Promise<FollowAttributes[]>;
  findByFollowing(followingId: string): Promise<FollowAttributes[]>;
  findOne(followerId: string, followingId: string): Promise<FollowAttributes | null>;
  create(followerId: string, followingId: string): Promise<FollowAttributes>;
  delete(id: string): Promise<boolean>;
  countByFollower(followerId: string): Promise<number>;
  countByFollowing(followingId: string): Promise<number>;
}

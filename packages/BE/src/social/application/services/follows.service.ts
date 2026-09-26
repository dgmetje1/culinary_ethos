import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { FOLLOW_REPOSITORY, IFollowRepository } from "../repositories/i-follow.repository";

@Injectable()
export class FollowsService {
  constructor(
    @Inject(FOLLOW_REPOSITORY)
    private readonly followRepository: IFollowRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async follow(
    followerId: string,
    followingId: string,
    followerName?: string,
  ): Promise<{ id: string }> {
    if (followerId === followingId) {
      throw new BadRequestException("Cannot follow yourself");
    }
    const existing = await this.followRepository.findOne(followerId, followingId);
    if (existing) {
      throw new ConflictException("Already following this user");
    }
    const follow = await this.followRepository.create(followerId, followingId);

    this.eventEmitter.emit("follow.created", {
      followerId,
      followingId,
      followId: follow.id,
      followerName,
    });

    return { id: follow.id };
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const existing = await this.followRepository.findOne(followerId, followingId);
    if (!existing) {
      throw new NotFoundException("Follow not found");
    }
    await this.followRepository.delete(existing.id);
  }

  async isFollowing(followerId: string, followingId: string): Promise<{ following: boolean }> {
    const existing = await this.followRepository.findOne(followerId, followingId);
    return { following: !!existing };
  }

  async getFollowers(userId: string): Promise<{ count: number }> {
    const count = await this.followRepository.countByFollowing(userId);
    return { count };
  }

  async getFollowing(userId: string): Promise<{ count: number }> {
    const count = await this.followRepository.countByFollower(userId);
    return { count };
  }

  async getFollowingList(userId: string): Promise<{ followingId: string }[]> {
    const follows = await this.followRepository.findByFollower(userId);
    return follows.map((f) => ({ followingId: f.followingId }));
  }

  async getFollowerList(userId: string): Promise<{ followerId: string }[]> {
    const follows = await this.followRepository.findByFollowing(userId);
    return follows.map((f) => ({ followerId: f.followerId }));
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ulid } from "ulidx";
import { Follow, FollowAttributes } from "../../domain/models/follow.entity";
import { IFollowRepository } from "../../application/repositories/i-follow.repository";

@Injectable()
export class FollowRepository implements IFollowRepository {
  constructor(
    @InjectRepository(Follow)
    private readonly repository: Repository<Follow>,
  ) {}

  async findByFollower(followerId: string): Promise<FollowAttributes[]> {
    const results = await this.repository.find({
      where: { followerId },
      order: { createdAt: "DESC" },
    });
    return results.map((r) => this.toAttributes(r));
  }

  async findByFollowing(followingId: string): Promise<FollowAttributes[]> {
    const results = await this.repository.find({
      where: { followingId },
      order: { createdAt: "DESC" },
    });
    return results.map((r) => this.toAttributes(r));
  }

  async findOne(followerId: string, followingId: string): Promise<FollowAttributes | null> {
    const result = await this.repository.findOne({
      where: { followerId, followingId },
    });
    return result ? this.toAttributes(result) : null;
  }

  async create(followerId: string, followingId: string): Promise<FollowAttributes> {
    const follow = this.repository.create({
      id: ulid(),
      followerId,
      followingId,
    });
    const entity = await this.repository.save(follow);
    return this.toAttributes(entity as Follow);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async countByFollower(followerId: string): Promise<number> {
    return this.repository.count({ where: { followerId } });
  }

  async countByFollowing(followingId: string): Promise<number> {
    return this.repository.count({ where: { followingId } });
  }

  private toAttributes(entity: Follow): FollowAttributes {
    return {
      id: entity.id,
      followerId: entity.followerId,
      followingId: entity.followingId,
      createdAt: entity.createdAt,
    };
  }
}

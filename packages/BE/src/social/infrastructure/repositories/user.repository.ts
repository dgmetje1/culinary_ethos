import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ulid } from "ulidx";
import { User, UserAttributes } from "../../domain/models";
import {
  IUserRepository,
  CreateUserInput,
  UpdateUserInput,
} from "../../application/repositories/i-user.repository";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<UserAttributes | null> {
    const result = await this.userRepository.findOne({ where: { id } });
    return result ? this.toAttributes(result) : null;
  }

  async findByAccountId(accountId: string): Promise<UserAttributes | null> {
    const result = await this.userRepository.findOne({
      where: { account_id: accountId },
    });
    return result ? this.toAttributes(result) : null;
  }

  async findByIdWithSummaryFields(id: string): Promise<UserAttributes | null> {
    const result = await this.userRepository.findOne({
      where: { id },
      select: ["id", "nick_name", "name", "last_name", "profile_picture", "position", "location"],
    });
    return result
      ? {
          id: result.id,
          account_id: "",
          nick_name: result.nick_name,
          name: result.name,
          last_name: result.last_name,
          email: "",
          language: "",
          profile_picture: result.profile_picture,
          description: result.description,
          position: result.position,
          location: result.location,
          role: "",
          status: "",
        }
      : null;
  }

  async findAll(): Promise<UserAttributes[]> {
    const results = await this.userRepository.find({
      order: { name: "ASC" },
    });
    return results.map((r) => this.toAttributes(r));
  }

  async countNewThisMonth(): Promise<number> {
    return this.userRepository.count();
  }

  async countAll(): Promise<number> {
    return this.userRepository.count();
  }

  async create(data: CreateUserInput): Promise<UserAttributes> {
    const user = this.userRepository.create({
      id: ulid(),
      ...data,
    });
    const saved = await this.userRepository.save(user);
    return this.toAttributes(saved);
  }

  async update(id: string, data: UpdateUserInput): Promise<UserAttributes | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = await this.userRepository.save({ ...existing, ...data });
    return this.toAttributes(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toAttributes(user: User): UserAttributes {
    return {
      id: user.id,
      account_id: user.account_id,
      nick_name: user.nick_name,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      language: user.language,
      profile_picture: user.profile_picture,
      description: user.description,
      position: user.position,
      location: user.location,
      role: user.role,
      status: user.status,
    };
  }
}

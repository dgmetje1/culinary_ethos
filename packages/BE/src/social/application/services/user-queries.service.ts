import { Injectable, Inject } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EntityNotFoundError, InvalidParameterError } from "../../../common/exceptions";
import {
  UserAccountResponseDto,
  UserAdminResponseDto,
  UserSummaryResponseDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from "../dto";
import {
  USER_REPOSITORY,
  IUserRepository,
  UpdateUserInput,
} from "../repositories/i-user.repository";
import { UserUpdatedEvent } from "../events/user-updated.event";

@Injectable()
export class UserQueriesService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private mapToAdminResponse(result: {
    id: string;
    account_id: string;
    email: string;
    nick_name: string;
    name: string;
    last_name: string;
    language: string;
    profile_picture: string | null;
    description: string | null;
    position: string | null;
    location: string | null;
    role: string;
    status: string;
  }): UserAdminResponseDto {
    return {
      id: result.id,
      accountId: result.account_id,
      email: result.email,
      nickName: result.nick_name,
      name: result.name,
      lastName: result.last_name,
      language: result.language,
      profilePicture: result.profile_picture,
      description: result.description,
      position: result.position,
      location: result.location,
      role: result.role,
      status: result.status,
    };
  }

  private mapToAccountResponse(result: {
    id: string;
    account_id: string;
    email: string;
    nick_name: string;
    name: string;
    last_name: string;
    language: string;
    profile_picture: string | null;
    description: string | null;
    position: string | null;
    location: string | null;
  }): UserAccountResponseDto {
    return {
      id: result.id,
      accountId: result.account_id,
      email: result.email,
      nickName: result.nick_name,
      name: result.name,
      lastName: result.last_name,
      language: result.language,
      profilePicture: result.profile_picture,
      description: result.description,
      position: result.position,
      location: result.location,
    };
  }

  async getDataById(id: string): Promise<UserAccountResponseDto> {
    const result = await this.userRepository.findById(id);
    if (!result) {
      throw new EntityNotFoundError("User not found", "User", [{ id }]);
    }
    return this.mapToAccountResponse(result);
  }

  async getDataByAccountId(accountId: string): Promise<UserAccountResponseDto> {
    const result = await this.userRepository.findByAccountId(accountId);
    if (!result) {
      throw new EntityNotFoundError("User not found", "User", [{ accountId }]);
    }
    return this.mapToAccountResponse(result);
  }

  async getDataSummaryById(id: string): Promise<UserSummaryResponseDto> {
    const result = await this.userRepository.findByIdWithSummaryFields(id);
    if (!result) {
      throw new EntityNotFoundError("User not found", "User", [{ id }]);
    }

    return {
      id: result.id,
      nickName: result.nick_name,
      name: result.name,
      lastName: result.last_name,
      profilePicture: result.profile_picture,
      position: result.position,
      location: result.location,
    };
  }

  async createUser(data: CreateUserRequestDto): Promise<UserAccountResponseDto> {
    const result = await this.userRepository.create(data);
    return this.mapToAccountResponse(result);
  }

  private containsUrl(text: string): boolean {
    return /https?:\/\/[^\s]+/.test(text);
  }

  async updateUser(id: string, data: UpdateUserRequestDto): Promise<UserAccountResponseDto> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError("User not found", "User", [{ id }]);
    }

    if (data.description !== undefined && this.containsUrl(data.description)) {
      throw new InvalidParameterError("Description must not contain links", "User");
    }

    const result = await this.userRepository.update(id, data);
    if (!result) {
      throw new EntityNotFoundError("User not found", "User", [{ id }]);
    }

    const changes: { nickname?: string; picture?: string } = {};
    if (data.nick_name !== undefined && data.nick_name !== existing.nick_name) {
      changes.nickname = data.nick_name;
    }
    if (data.profile_picture !== undefined && data.profile_picture !== existing.profile_picture) {
      changes.picture = data.profile_picture;
    }
    if (Object.keys(changes).length > 0) {
      this.eventEmitter.emit("user.updated", new UserUpdatedEvent(existing.account_id, changes));
    }

    return this.mapToAccountResponse(result);
  }

  async deleteUser(id: string): Promise<boolean> {
    const exists = await this.userRepository.findById(id);
    if (!exists) {
      throw new EntityNotFoundError("User not found", "User", [{ id }]);
    }
    return this.userRepository.delete(id);
  }

  async getAllUsers(): Promise<UserAdminResponseDto[]> {
    const results = await this.userRepository.findAll();
    return results.map((r) => this.mapToAdminResponse(r));
  }

  async suspendUser(id: string): Promise<UserAdminResponseDto> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError("User not found", "User", [{ id }]);
    }
    const result = await this.userRepository.update(id, {
      status: "suspended",
    } as UpdateUserInput);
    return this.mapToAdminResponse(result!);
  }

  async activateUser(id: string): Promise<UserAdminResponseDto> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError("User not found", "User", [{ id }]);
    }
    const result = await this.userRepository.update(id, {
      status: "active",
    } as UpdateUserInput);
    return this.mapToAdminResponse(result!);
  }

  async changeUserRole(id: string, role: string): Promise<UserAdminResponseDto> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError("User not found", "User", [{ id }]);
    }
    const result = await this.userRepository.update(id, {
      role,
    } as UpdateUserInput);
    return this.mapToAdminResponse(result!);
  }
}

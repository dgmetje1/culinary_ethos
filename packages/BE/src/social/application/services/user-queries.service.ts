import { Injectable, Inject } from '@nestjs/common';
import { EntityNotFoundError } from '../../../common/exceptions';
import {
  UserAccountResponseDto,
  UserSummaryResponseDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from '../dto';
import { USER_REPOSITORY, IUserRepository } from '../repositories/i-user.repository';

@Injectable()
export class UserQueriesService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  private mapToAccountResponse(result: {
    id: string;
    account_id: string;
    email: string;
    nick_name: string;
    name: string;
    last_name: string;
    language: string;
    profile_picture: string | null;
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
    };
  }

  async getDataById(id: string): Promise<UserAccountResponseDto> {
    const result = await this.userRepository.findById(id);
    if (!result) {
      throw new EntityNotFoundError('User not found', 'User', [{ id }]);
    }
    return this.mapToAccountResponse(result);
  }

  async getDataByAccountId(accountId: string): Promise<UserAccountResponseDto> {
    const result = await this.userRepository.findByAccountId(accountId);
    if (!result) {
      throw new EntityNotFoundError('User not found', 'User', [{ accountId }]);
    }
    return this.mapToAccountResponse(result);
  }

  async getDataSummaryById(id: string): Promise<UserSummaryResponseDto> {
    const result = await this.userRepository.findByIdWithSummaryFields(id);
    if (!result) {
      throw new EntityNotFoundError('User not found', 'User', [{ id }]);
    }

    return {
      id: result.id,
      nickName: result.nick_name,
      name: result.name,
      lastName: result.last_name,
      profilePicture: result.profile_picture,
    };
  }

  async createUser(data: CreateUserRequestDto): Promise<UserAccountResponseDto> {
    const result = await this.userRepository.create(data);
    return this.mapToAccountResponse(result);
  }

  async updateUser(
    id: string,
    data: UpdateUserRequestDto,
  ): Promise<UserAccountResponseDto> {
    const result = await this.userRepository.update(id, data);
    if (!result) {
      throw new EntityNotFoundError('User not found', 'User', [{ id }]);
    }
    return this.mapToAccountResponse(result);
  }

  async deleteUser(id: string): Promise<boolean> {
    const exists = await this.userRepository.findById(id);
    if (!exists) {
      throw new EntityNotFoundError('User not found', 'User', [{ id }]);
    }
    return this.userRepository.delete(id);
  }
}
import { UserAttributes } from '../../domain/models';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface CreateUserInput {
  account_id: string;
  nick_name: string;
  name: string;
  last_name: string;
  email: string;
  language: string;
  profile_picture?: string;
}

export interface UpdateUserInput {
  account_id?: string;
  nick_name?: string;
  name?: string;
  last_name?: string;
  email?: string;
  language?: string;
  profile_picture?: string;
  description?: string;
  role?: string;
  status?: string;
}

export interface IUserRepository {
  findById(id: string): Promise<UserAttributes | null>;
  findByAccountId(accountId: string): Promise<UserAttributes | null>;
  findByIdWithSummaryFields(id: string): Promise<UserAttributes | null>;
  findAll(): Promise<UserAttributes[]>;
  create(data: CreateUserInput): Promise<UserAttributes>;
  update(id: string, data: UpdateUserInput): Promise<UserAttributes | null>;
  delete(id: string): Promise<boolean>;
  countAll(): Promise<number>;
  countNewThisMonth(): Promise<number>;
}
import { Api } from '@/lib/api';
import { User, UserAccountDTO, UserDTO, UserSummaryDTO } from '@/types/user';

const authRequestOptions = { withAuth: true };

export const getAccount = () => {
  try {
    return new Api().get<UserAccountDTO>('auth/profile', authRequestOptions);
  } catch (err: unknown) {
    throw new Error('User not found');
  }
};

export const getUser = () => {
  return new Api().get<UserDTO>('auth/profile', authRequestOptions);
};

export const getAllUsers = () => {
  return new Api().get<(User & { role: string; status: string })[]>('users/all');
};

export const getUserSummary = (userId: string) => {
  return new Api().get<UserSummaryDTO>(`users/${userId}/summary`);
};

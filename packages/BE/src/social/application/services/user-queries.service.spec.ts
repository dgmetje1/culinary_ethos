import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserQueriesService } from './user-queries.service';
import { EntityNotFoundError } from '../../../common/exceptions';

describe('UserQueriesService', () => {
  let service: UserQueriesService;
  let mockRepository: any;
  let mockEventEmitter: any;

  const mockUser = {
    id: 'user123',
    account_id: 'acc123',
    nick_name: 'testuser',
    name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    language: 'en',
    profile_picture: null,
  };

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findByAccountId: vi.fn(),
      findByIdWithSummaryFields: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    mockEventEmitter = {
      emit: vi.fn(),
    };
    service = new UserQueriesService(mockRepository, mockEventEmitter);
  });

  describe('getDataById', () => {
    it('should return user account response', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await service.getDataById('user123');

      expect(result).toEqual({
        id: 'user123',
        accountId: 'acc123',
        nickName: 'testuser',
        name: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        language: 'en',
        profilePicture: null,
      });
      expect(mockRepository.findById).toHaveBeenCalledWith('user123');
    });

    it('should throw EntityNotFoundError if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getDataById('invalid')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('getDataByAccountId', () => {
    it('should return user account response by account id', async () => {
      mockRepository.findByAccountId.mockResolvedValue(mockUser);

      const result = await service.getDataByAccountId('acc123');

      expect(result.accountId).toBe('acc123');
      expect(mockRepository.findByAccountId).toHaveBeenCalledWith('acc123');
    });

    it('should throw EntityNotFoundError if user not found', async () => {
      mockRepository.findByAccountId.mockResolvedValue(null);

      await expect(service.getDataByAccountId('invalid')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('getDataSummaryById', () => {
    it('should return user summary response', async () => {
      mockRepository.findByIdWithSummaryFields.mockResolvedValue({
        id: 'user123',
        account_id: '',
        nick_name: 'testuser',
        name: 'Test',
        last_name: 'User',
        email: '',
        language: '',
        profile_picture: null,
      });

      const result = await service.getDataSummaryById('user123');

      expect(result).toEqual({
        id: 'user123',
        nickName: 'testuser',
        name: 'Test',
        lastName: 'User',
        profilePicture: null,
      });
    });

    it('should throw EntityNotFoundError if user not found', async () => {
      mockRepository.findByIdWithSummaryFields.mockResolvedValue(null);

      await expect(service.getDataSummaryById('invalid')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('createUser', () => {
    it('should create and return user', async () => {
      mockRepository.create.mockResolvedValue(mockUser);

      const result = await service.createUser({
        account_id: 'acc123',
        nick_name: 'testuser',
        name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        language: 'en',
      });

      expect(result.id).toBe('user123');
      expect(mockRepository.create).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update and return user', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue({ ...mockUser, nick_name: 'updated' });

      const result = await service.updateUser('user123', { nick_name: 'updated' });

      expect(result.nickName).toBe('updated');
      expect(mockRepository.findById).toHaveBeenCalledWith('user123');
      expect(mockRepository.update).toHaveBeenCalledWith('user123', { nick_name: 'updated' });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'user.updated',
        expect.objectContaining({
          accountId: 'acc123',
          changes: { nickname: 'updated' },
        }),
      );
    });

    it('should skip event when nick_name unchanged', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue(mockUser);

      const result = await service.updateUser('user123', { name: 'NewName' });

      expect(result.nickName).toBe('testuser');
      expect(mockEventEmitter.emit).not.toHaveBeenCalled();
    });

    it('should throw EntityNotFoundError if user not found on findById', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.updateUser('invalid', { nick_name: 'updated' })).rejects.toThrow(EntityNotFoundError);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw EntityNotFoundError if update returns null', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.updateUser('user123', { nick_name: 'updated' })).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.deleteUser('user123');

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith('user123');
    });

    it('should throw EntityNotFoundError if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.deleteUser('invalid')).rejects.toThrow(EntityNotFoundError);
    });
  });
});
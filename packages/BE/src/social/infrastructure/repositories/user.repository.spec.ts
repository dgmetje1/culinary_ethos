import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockTypeOrmRepo: any;

  const mockEntity = {
    id: 'user123',
    account_id: 'acc123',
    nick_name: 'testuser',
    name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    language: 'en',
    profile_picture: null,
  };

  const expectedAttributes = {
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
    mockTypeOrmRepo = {
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
    repository = new UserRepository(mockTypeOrmRepo);
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById('user123');

      expect(result).toEqual(expectedAttributes);
      expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({ where: { id: 'user123' } });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('invalid');

      expect(result).toBeNull();
    });
  });

  describe('findByAccountId', () => {
    it('should return user when found by account id', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findByAccountId('acc123');

      expect(result).toEqual(expectedAttributes);
      expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({ where: { account_id: 'acc123' } });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByAccountId('invalid');

      expect(result).toBeNull();
    });
  });

  describe('findByIdWithSummaryFields', () => {
    it('should return user with only summary fields', async () => {
      const summaryEntity = {
        id: 'user123',
        account_id: 'acc123',
        nick_name: 'testuser',
        name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        language: 'en',
        profile_picture: null,
      };
      mockTypeOrmRepo.findOne.mockResolvedValue(summaryEntity);

      const result = await repository.findByIdWithSummaryFields('user123');

      expect(result).toEqual({
        id: 'user123',
        account_id: '',
        nick_name: 'testuser',
        name: 'Test',
        last_name: 'User',
        email: '',
        language: '',
        profile_picture: null,
      });
      expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'user123' },
        select: ['id', 'nick_name', 'name', 'last_name', 'profile_picture'],
      });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByIdWithSummaryFields('invalid');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return user', async () => {
      const createdEntity = { ...mockEntity, id: 'new-id' };
      mockTypeOrmRepo.create.mockReturnValue(createdEntity);
      mockTypeOrmRepo.save.mockResolvedValue(createdEntity);

      const result = await repository.create({
        account_id: 'acc123',
        nick_name: 'testuser',
        name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        language: 'en',
      });

      expect(result.id).toBeDefined();
      expect(mockTypeOrmRepo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user when found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);
      const updatedEntity = { ...mockEntity, nick_name: 'updated' };
      mockTypeOrmRepo.save.mockResolvedValue(updatedEntity);

      const result = await repository.update('user123', { nick_name: 'updated' });

      expect(result).toEqual({ ...expectedAttributes, nick_name: 'updated' });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.update('invalid', {});

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return true when deleted', async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.delete('user123');

      expect(result).toBe(true);
    });

    it('should return false when nothing deleted', async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 0 });

      const result = await repository.delete('invalid');

      expect(result).toBe(false);
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: any;

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  };

  beforeEach(() => {
    mockRepository = {
      find: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };
    service = new UsersService(mockRepository);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockUser);
      expect(mockRepository.find).toHaveBeenCalledOnce();
    });

    it('should return empty array when no users', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create and return user', async () => {
      const userData = { name: 'Jane Doe', email: 'jane@example.com', age: 25 };
      const createdEntity = { id: 2, ...userData };
      mockRepository.create.mockReturnValue(createdEntity);
      mockRepository.save.mockResolvedValue(createdEntity);

      const result = await service.create(userData);

      expect(result).toEqual(createdEntity);
      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdEntity);
    });

    it('should pass through to repository create', async () => {
      const userData = { name: 'Test', email: 'test@test.com', age: 20 };
      const createdEntity = { id: 3, ...userData };
      mockRepository.create.mockReturnValue(createdEntity);
      mockRepository.save.mockResolvedValue(createdEntity);

      await service.create(userData);

      expect(mockRepository.create).toHaveBeenCalledWith(userData);
    });
  });
});

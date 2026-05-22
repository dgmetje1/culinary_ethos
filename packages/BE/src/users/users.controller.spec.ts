import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersController } from './users.controller';

describe('UsersController (Legacy)', () => {
  let controller: UsersController;
  let mockService: any;

  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  ];

  beforeEach(() => {
    mockService = {
      findAll: vi.fn(),
      create: vi.fn(),
    };
    controller = new UsersController(mockService);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(result).toEqual(mockUsers);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const newUser = { id: 2, name: 'Jane', email: 'jane@test.com', age: 25 };
      mockService.create.mockResolvedValue(newUser);
      const userData = { name: 'Jane', email: 'jane@test.com', age: 25 };

      const result = await controller.create(userData);

      expect(result).toEqual(newUser);
      expect(mockService.create).toHaveBeenCalledWith(userData);
    });
  });
});

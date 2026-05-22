import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoryRepository } from './category.repository';

describe('CategoryRepository', () => {
  let repository: CategoryRepository;
  let mockTypeOrmRepo: any;

  const mockCategoryEntity = {
    id: 'cat123',
    content: [
      { language: 'en', name: 'Desserts', description: 'Sweet treats' },
    ],
  };

  beforeEach(() => {
    mockTypeOrmRepo = {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    repository = new CategoryRepository(mockTypeOrmRepo);
  });

  describe('findAll', () => {
    it('should return all categories as attributes', async () => {
      mockTypeOrmRepo.find.mockResolvedValue([mockCategoryEntity]);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'cat123',
        content: [{ language: 'en', name: 'Desserts', description: 'Sweet treats' }],
      });
    });

    it('should return empty array when none exist', async () => {
      mockTypeOrmRepo.find.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return category when found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockCategoryEntity);

      const result = await repository.findById('cat123');

      expect(result).toEqual({
        id: 'cat123',
        content: [{ language: 'en', name: 'Desserts', description: 'Sweet treats' }],
      });
      expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({ where: { id: 'cat123' } });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('invalid');

      expect(result).toBeNull();
    });
  });

  describe('findByIds', () => {
    it('should return categories for given ids', async () => {
      mockTypeOrmRepo.find.mockResolvedValue([mockCategoryEntity]);

      const result = await repository.findByIds(['cat123']);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('cat123');
    });

    it('should return empty array for empty ids list', async () => {
      const result = await repository.findByIds([]);
      expect(result).toEqual([]);
      expect(mockTypeOrmRepo.find).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return category', async () => {
      const createdEntity = { ...mockCategoryEntity, id: 'new-id' };
      mockTypeOrmRepo.create.mockReturnValue(createdEntity);
      mockTypeOrmRepo.save.mockResolvedValue(createdEntity);

      const result = await repository.create([
        { language: 'en', name: 'Desserts', description: 'Sweet treats' },
      ]);

      expect(result.id).toBeDefined();
      expect(mockTypeOrmRepo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update category when found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockCategoryEntity);
      mockTypeOrmRepo.update.mockResolvedValue({ affected: 1 });
      const newContent = [{ language: 'en', name: 'Updated', description: 'Desc' }];

      const result = await repository.update('cat123', newContent);

      expect(result).toEqual({ id: 'cat123', content: newContent });
      expect(mockTypeOrmRepo.update).toHaveBeenCalledWith('cat123', { content: newContent });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.update('invalid', []);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return true when deleted', async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.delete('cat123');

      expect(result).toBe(true);
      expect(mockTypeOrmRepo.delete).toHaveBeenCalledWith('cat123');
    });

    it('should return false when nothing deleted', async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 0 });

      const result = await repository.delete('invalid');

      expect(result).toBe(false);
    });
  });

  describe('findByIds with results', () => {
    it('should query by In(ids) and map correctly', async () => {
      const entities = [
        { id: 'a', content: [] },
        { id: 'b', content: [{ language: 'en', name: 'B', description: 'B desc' }] },
      ];
      mockTypeOrmRepo.find.mockResolvedValue(entities);

      const result = await repository.findByIds(['a', 'b']);

      expect(result).toHaveLength(2);
      expect(result[1].content[0].name).toBe('B');
    });
  });
});

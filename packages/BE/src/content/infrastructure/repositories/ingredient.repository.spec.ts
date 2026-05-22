import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IngredientRepository } from './ingredient.repository';

describe('IngredientRepository', () => {
  let repository: IngredientRepository;
  let mockTypeOrmRepo: any;

  const mockEntity = {
    id: 'ing123',
    content: [
      { language: 'en', name: 'Sugar', singularName: 'Sugar' },
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
    repository = new IngredientRepository(mockTypeOrmRepo);
  });

  describe('findAll', () => {
    it('should return all ingredients', async () => {
      mockTypeOrmRepo.find.mockResolvedValue([mockEntity]);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('ing123');
    });
  });

  describe('findById', () => {
    it('should return ingredient when found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById('ing123');

      expect(result).toEqual({ id: 'ing123', content: mockEntity.content });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('invalid');

      expect(result).toBeNull();
    });
  });

  describe('findByIds', () => {
    it('should return ingredients for ids', async () => {
      mockTypeOrmRepo.find.mockResolvedValue([mockEntity]);

      const result = await repository.findByIds(['ing123']);

      expect(result).toHaveLength(1);
    });

    it('should return empty for empty ids', async () => {
      const result = await repository.findByIds([]);
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create ingredient', async () => {
      const created = { ...mockEntity, id: 'new-id' };
      mockTypeOrmRepo.create.mockReturnValue(created);
      mockTypeOrmRepo.save.mockResolvedValue(created);

      const result = await repository.create([{ language: 'en', name: 'Sugar', singularName: 'Sugar' }]);

      expect(result.id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update when found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);
      const newContent = [{ language: 'en', name: 'Updated', singularName: 'Updated' }];

      const result = await repository.update('ing123', newContent);

      expect(result).toEqual({ id: 'ing123', content: newContent });
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

      const result = await repository.delete('ing123');

      expect(result).toBe(true);
    });

    it('should return false when nothing deleted', async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 0 });

      const result = await repository.delete('invalid');

      expect(result).toBe(false);
    });
  });

  describe('merge', () => {
    it('should merge ingredient contents', async () => {
      const sourceEntity = {
        id: 'ing456',
        content: [{ language: 'es', name: 'Azúcar', singularName: 'Azúcar' }],
      };
      mockTypeOrmRepo.findOne
        .mockResolvedValueOnce(mockEntity)
        .mockResolvedValueOnce(sourceEntity);
      mockTypeOrmRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.merge('ing123', ['ing456']);

      expect(result).toBe(true);
      expect(mockTypeOrmRepo.update).toHaveBeenCalledWith('ing123', {
        content: [
          { language: 'en', name: 'Sugar', singularName: 'Sugar' },
          { language: 'es', name: 'Azúcar', singularName: 'Azúcar' },
        ],
      });
      expect(mockTypeOrmRepo.delete).toHaveBeenCalledWith('ing456');
    });

    it('should return false when target not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.merge('invalid', ['ing456']);

      expect(result).toBe(false);
    });

    it('should skip source ingredients that do not exist', async () => {
      mockTypeOrmRepo.findOne
        .mockResolvedValueOnce(mockEntity)
        .mockResolvedValueOnce(null);

      const result = await repository.merge('ing123', ['nonexistent']);

      expect(result).toBe(true);
      expect(mockTypeOrmRepo.delete).not.toHaveBeenCalled();
    });

    it('should skip duplicate language content during merge', async () => {
      const sourceEntity = {
        id: 'ing456',
        content: [{ language: 'en', name: 'Sugar', singularName: 'Sugar' }],
      };
      mockTypeOrmRepo.findOne
        .mockResolvedValueOnce(mockEntity)
        .mockResolvedValueOnce(sourceEntity);
      mockTypeOrmRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.merge('ing123', ['ing456']);

      expect(result).toBe(true);
      expect(mockTypeOrmRepo.update).toHaveBeenCalledWith('ing123', {
        content: [
          { language: 'en', name: 'Sugar', singularName: 'Sugar' },
        ],
      });
    });
  });
});

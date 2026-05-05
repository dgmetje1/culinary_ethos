import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoriesService } from './categories.service';
import { EntityNotFoundError, InvalidParameterError } from '../../../common/exceptions';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let mockRepository: any;

  const mockCategory = {
    id: 'cat123',
    content: [
      { language: 'en', name: 'Desserts', description: 'Sweet treats' },
      { language: 'es', name: 'Postres', description: 'Dulces' },
    ],
  };

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    service = new CategoriesService(mockRepository);
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      mockRepository.findAll.mockResolvedValue([mockCategory]);

      const result = await service.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('cat123');
      expect(result[0].content.en.name).toBe('Desserts');
    });

    it('should return empty array when no categories', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create category successfully', async () => {
      mockRepository.create.mockResolvedValue(mockCategory);

      await service.create({
        content: [{ language: 'en', name: 'Desserts', description: 'Sweet treats' }],
      });

      expect(mockRepository.create).toHaveBeenCalledWith([
        { language: 'en', name: 'Desserts', description: 'Sweet treats' },
      ]);
    });

    it('should throw InvalidParameterError when content is empty', async () => {
      await expect(service.create({ content: [] })).rejects.toThrow(InvalidParameterError);
    });

    it('should throw InvalidParameterError when content is undefined', async () => {
      await expect(service.create({} as any)).rejects.toThrow(InvalidParameterError);
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockCategory);
      mockRepository.update.mockResolvedValue(mockCategory);

      await service.update({
        id: 'cat123',
        content: [{ language: 'en', name: 'Updated', description: 'Updated desc' }],
      });

      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('should throw EntityNotFoundError when category not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update({
          id: 'invalid',
          content: [{ language: 'en', name: 'Updated', description: 'Updated desc' }],
        }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete category successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockCategory);
      mockRepository.delete.mockResolvedValue(true);

      await service.delete('cat123');

      expect(mockRepository.delete).toHaveBeenCalledWith('cat123');
    });

    it('should throw EntityNotFoundError when category not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete('invalid')).rejects.toThrow(EntityNotFoundError);
    });
  });
});
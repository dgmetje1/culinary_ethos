import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoriesController } from './categories.controller';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let mockService: any;

  const mockCategories = [
    {
      id: 'cat123',
      content: { en: { name: 'Desserts', description: 'Sweet treats' } },
    },
  ];

  beforeEach(() => {
    mockService = {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    controller = new CategoriesController(mockService);
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      mockService.getAll.mockResolvedValue(mockCategories);

      const result = await controller.getAll();

      expect(result).toEqual(mockCategories);
      expect(mockService.getAll).toHaveBeenCalledOnce();
    });
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto = { content: [{ language: 'en', name: 'Desserts', description: 'Sweet treats' }] };

      await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const dto = { id: 'cat123', content: [{ language: 'en', name: 'Updated', description: 'Desc' }] };

      await controller.update(dto);

      expect(mockService.update).toHaveBeenCalledWith(dto);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      await controller.delete('cat123');

      expect(mockService.delete).toHaveBeenCalledWith('cat123');
    });
  });
});

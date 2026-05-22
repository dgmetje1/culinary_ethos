import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IngredientsController } from './ingredients.controller';

describe('IngredientsController', () => {
  let controller: IngredientsController;
  let mockService: any;

  const mockIngredients = [
    { id: 'ing123', content: { en: { name: 'Sugar', singularName: 'Sugar' } } },
  ];

  beforeEach(() => {
    mockService = {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      merge: vi.fn(),
    };
    controller = new IngredientsController(mockService);
  });

  describe('getAll', () => {
    it('should return all ingredients', async () => {
      mockService.getAll.mockResolvedValue(mockIngredients);

      const result = await controller.getAll();

      expect(result).toEqual(mockIngredients);
    });
  });

  describe('create', () => {
    it('should create and return id', async () => {
      mockService.create.mockResolvedValue({ id: 'new123' });
      const dto = { content: [{ language: 'en', name: 'Sugar', singularName: 'Sugar' }] };

      const result = await controller.create(dto);

      expect(result).toEqual({ id: 'new123' });
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update an ingredient', async () => {
      const dto = { id: 'ing123', content: [{ language: 'en', name: 'Updated', singularName: 'Updated' }] };

      await controller.update(dto);

      expect(mockService.update).toHaveBeenCalledWith(dto);
    });
  });

  describe('delete', () => {
    it('should delete an ingredient', async () => {
      await controller.delete('ing123');

      expect(mockService.delete).toHaveBeenCalledWith('ing123');
    });
  });

  describe('merge', () => {
    it('should merge ingredients', async () => {
      const dto = { targetId: 'ing123', ingredientIds: ['ing456', 'ing789'] };

      await controller.merge(dto);

      expect(mockService.merge).toHaveBeenCalledWith(dto);
    });
  });
});

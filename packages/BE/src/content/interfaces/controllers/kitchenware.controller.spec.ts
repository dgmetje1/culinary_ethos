import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KitchenwareController } from './kitchenware.controller';

describe('KitchenwareController', () => {
  let controller: KitchenwareController;
  let mockService: any;

  const mockKitchenware = [
    { id: 'kit123', content: { en: { name: 'Pan', singularName: 'Pan' } } },
  ];

  beforeEach(() => {
    mockService = {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      merge: vi.fn(),
    };
    controller = new KitchenwareController(mockService);
  });

  describe('getAll', () => {
    it('should return all kitchenware', async () => {
      mockService.getAll.mockResolvedValue(mockKitchenware);

      const result = await controller.getAll();

      expect(result).toEqual(mockKitchenware);
    });
  });

  describe('create', () => {
    it('should create and return id', async () => {
      mockService.create.mockResolvedValue({ id: 'new123' });
      const dto = { content: [{ language: 'en', name: 'Pan', singularName: 'Pan' }] };

      const result = await controller.create(dto);

      expect(result).toEqual({ id: 'new123' });
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update kitchenware', async () => {
      const dto = { id: 'kit123', content: [{ language: 'en', name: 'Updated', singularName: 'Updated' }] };

      await controller.update(dto);

      expect(mockService.update).toHaveBeenCalledWith(dto);
    });
  });

  describe('delete', () => {
    it('should delete kitchenware', async () => {
      await controller.delete('kit123');

      expect(mockService.delete).toHaveBeenCalledWith('kit123');
    });
  });

  describe('merge', () => {
    it('should merge kitchenware', async () => {
      const dto = { targetId: 'kit123', kitchenwareIds: ['kit456', 'kit789'] };

      await controller.merge(dto);

      expect(mockService.merge).toHaveBeenCalledWith(dto);
    });
  });
});

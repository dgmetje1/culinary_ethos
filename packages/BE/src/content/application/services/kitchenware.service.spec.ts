import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KitchenwareService } from './kitchenware.service';
import { EntityNotFoundError, InvalidParameterError } from '../../../common/exceptions';

describe('KitchenwareService', () => {
  let service: KitchenwareService;
  let mockRepository: any;

  const mockKitchenware = {
    id: 'kit123',
    content: [
      { language: 'en', name: 'Pan', singularName: 'Pan' },
      { language: 'es', name: 'Sartén', singularName: 'Sartén' },
    ],
  };

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      merge: vi.fn(),
    };
    service = new KitchenwareService(mockRepository);
  });

  describe('getAll', () => {
    it('should return all kitchenware', async () => {
      mockRepository.findAll.mockResolvedValue([mockKitchenware]);

      const result = await service.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('kit123');
    });
  });

  describe('create', () => {
    it('should create kitchenware successfully', async () => {
      mockRepository.create.mockResolvedValue(mockKitchenware);

      await service.create({
        content: [{ language: 'en', name: 'Pan', singularName: 'Pan' }],
      });

      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should throw InvalidParameterError when content is empty', async () => {
      await expect(service.create({ content: [] })).rejects.toThrow(InvalidParameterError);
    });
  });

  describe('update', () => {
    it('should update kitchenware successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockKitchenware);
      mockRepository.update.mockResolvedValue(mockKitchenware);

      await service.update({
        id: 'kit123',
        content: [{ language: 'en', name: 'Updated Pan', singularName: 'Pan' }],
      });

      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('should throw EntityNotFoundError when kitchenware not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update({
          id: 'invalid',
          content: [{ language: 'en', name: 'Updated', singularName: 'Updated' }],
        }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete kitchenware successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockKitchenware);
      mockRepository.delete.mockResolvedValue(true);

      await service.delete('kit123');

      expect(mockRepository.delete).toHaveBeenCalledWith('kit123');
    });

    it('should throw EntityNotFoundError when kitchenware not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete('invalid')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('merge', () => {
    it('should merge kitchenware successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockKitchenware);
      mockRepository.merge.mockResolvedValue(true);

      await service.merge({
        targetId: 'kit123',
        kitchenwareIds: ['kit456', 'kit789'],
      });

      expect(mockRepository.merge).toHaveBeenCalledWith('kit123', ['kit456', 'kit789']);
    });

    it('should throw EntityNotFoundError when target not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.merge({
          targetId: 'invalid',
          kitchenwareIds: ['kit456'],
        }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });
});
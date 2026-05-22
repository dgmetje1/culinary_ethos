import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MealPlansService } from './meal-plans.service';
import { EntityNotFoundError } from '../../../common/exceptions';

describe('MealPlansService', () => {
  let service: MealPlansService;
  let mockRepository: any;

  const mockPlan = {
    id: 'plan123',
    weekStart: '2024-01-01',
    entries: [
      {
        id: 'entry1',
        day: 1,
        mealType: 'breakfast',
        recipeId: 'rec1',
        recipeTitle: 'Pancakes',
        recipeImageUrl: 'http://example.com/pancakes.jpg',
      },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockResponse = {
    id: 'plan123',
    weekStart: '2024-01-01',
    entries: [
      {
        id: 'entry1',
        day: 1,
        mealType: 'breakfast',
        recipeId: 'rec1',
        recipeTitle: 'Pancakes',
        recipeImageUrl: 'http://example.com/pancakes.jpg',
      },
    ],
    createdAt: mockPlan.createdAt,
    updatedAt: mockPlan.updatedAt,
  };

  beforeEach(() => {
    mockRepository = {
      findByWeekStart: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    service = new MealPlansService(mockRepository);
  });

  describe('getByWeekStart', () => {
    it('should return meal plan when found', async () => {
      mockRepository.findByWeekStart.mockResolvedValue(mockPlan);

      const result = await service.getByWeekStart('2024-01-01');

      expect(result).toEqual(mockResponse);
      expect(mockRepository.findByWeekStart).toHaveBeenCalledWith('2024-01-01');
    });

    it('should return null when not found', async () => {
      mockRepository.findByWeekStart.mockResolvedValue(null);

      const result = await service.getByWeekStart('2024-99-99');

      expect(result).toBeNull();
    });
  });

  describe('getById', () => {
    it('should return meal plan by id', async () => {
      mockRepository.findById.mockResolvedValue(mockPlan);

      const result = await service.getById('plan123');

      expect(result).toEqual(mockResponse);
    });

    it('should throw EntityNotFoundError when not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getById('invalid')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('create', () => {
    it('should create meal plan and return response', async () => {
      mockRepository.create.mockResolvedValue(mockPlan);

      const result = await service.create({
        weekStart: '2024-01-01',
        entries: [
          {
            id: 'entry1',
            day: 1,
            mealType: 'breakfast',
            recipeId: 'rec1',
            recipeTitle: 'Pancakes',
            recipeImageUrl: 'http://example.com/pancakes.jpg',
          },
        ],
      });

      expect(result).toEqual(mockResponse);
      expect(mockRepository.create).toHaveBeenCalledWith({
        weekStart: '2024-01-01',
        entries: [
          {
            id: 'entry1',
            day: 1,
            mealType: 'breakfast',
            recipeId: 'rec1',
            recipeTitle: 'Pancakes',
            recipeImageUrl: 'http://example.com/pancakes.jpg',
          },
        ],
      });
    });

    it('should create meal plan without entries', async () => {
      const emptyMock = { ...mockPlan, entries: [] };
      const emptyResponse = { ...mockResponse, entries: [] };
      mockRepository.create.mockResolvedValue(emptyMock);

      const result = await service.create({ weekStart: '2024-01-01' });

      expect(result).toEqual(emptyResponse);
    });
  });

  describe('update', () => {
    it('should update meal plan entries', async () => {
      const updated = { ...mockPlan, entries: [] };
      const updatedResponse = { ...mockResponse, entries: [] };
      mockRepository.update.mockResolvedValue(updated);

      const result = await service.update('plan123', { entries: [] });

      expect(result).toEqual(updatedResponse);
      expect(mockRepository.update).toHaveBeenCalledWith('plan123', []);
    });

    it('should throw EntityNotFoundError when plan not found', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(
        service.update('invalid', { entries: [] }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete meal plan successfully', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await service.delete('plan123');

      expect(mockRepository.delete).toHaveBeenCalledWith('plan123');
    });

    it('should throw EntityNotFoundError when plan not found', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.delete('invalid')).rejects.toThrow(EntityNotFoundError);
    });
  });
});

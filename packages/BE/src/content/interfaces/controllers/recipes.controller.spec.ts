import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecipesController } from './recipes.controller';

describe('RecipesController', () => {
  let controller: RecipesController;
  let mockService: any;

  const mockRecipeListItem = {
    id: 'rec123',
    title: 'Chocolate Cake',
    categories: [],
    time: 30,
    author: 'chef123',
    thumbnailUrl: 'http://example.com/image.jpg',
    portions: 4,
  };

  const mockRecipeDetail = {
    id: 'rec123',
    title: 'Chocolate Cake',
    description: 'Delicious cake',
    thumbnailUrl: 'http://example.com/image.jpg',
    headerImg: null,
    difficulty: 2,
    time: 30,
    portions: 4,
    visibility: 1,
    author: 'chef123',
    publicationDate: new Date('2024-01-01'),
    categories: [],
    ingredients: [],
    kitchenware: [],
    steps: [],
  };

  const mockDailyRecipe = {
    id: 'rec123',
    title: 'Chocolate Cake',
    thumbnailUrl: 'http://example.com/image.jpg',
    time: 30,
    author: 'chef123',
    publicationDate: new Date('2024-01-01'),
    difficulty: 2,
    portions: 4,
    categories: [],
    ingredients: [],
  };

  beforeEach(() => {
    mockService = {
      getAll: vi.fn(),
      getById: vi.fn(),
      getDaily: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      addIngredients: vi.fn(),
      addKitchenware: vi.fn(),
      addSteps: vi.fn(),
    };
    controller = new RecipesController(mockService);
  });

  describe('getAll', () => {
    it('should return all recipes without category filter', async () => {
      mockService.getAll.mockResolvedValue([mockRecipeListItem]);

      const result = await controller.getAll(undefined, 'en');

      expect(result).toEqual([mockRecipeListItem]);
      expect(mockService.getAll).toHaveBeenCalledWith(undefined, 'en');
    });

    it('should return recipes filtered by category', async () => {
      mockService.getAll.mockResolvedValue([mockRecipeListItem]);

      const result = await controller.getAll(1, 'en');

      expect(result).toEqual([mockRecipeListItem]);
      expect(mockService.getAll).toHaveBeenCalledWith(1, 'en');
    });

    it('should use default language when not provided', async () => {
      mockService.getAll.mockResolvedValue([mockRecipeListItem]);

      await controller.getAll(undefined, undefined);

      expect(mockService.getAll).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('getDaily', () => {
    it('should return daily recipe', async () => {
      mockService.getDaily.mockResolvedValue(mockDailyRecipe);

      const result = await controller.getDaily();

      expect(result).toEqual(mockDailyRecipe);
    });
  });

  describe('getById', () => {
    it('should return recipe by id with language', async () => {
      mockService.getById.mockResolvedValue(mockRecipeDetail);

      const result = await controller.getById('rec123', 'en');

      expect(result).toEqual(mockRecipeDetail);
      expect(mockService.getById).toHaveBeenCalledWith('rec123', 'en');
    });

    it('should return recipe by id without language', async () => {
      mockService.getById.mockResolvedValue(mockRecipeDetail);

      const result = await controller.getById('rec123', undefined);

      expect(result).toEqual(mockRecipeDetail);
      expect(mockService.getById).toHaveBeenCalledWith('rec123', undefined);
    });
  });

  describe('create', () => {
    it('should create recipe and return id', async () => {
      mockService.create.mockResolvedValue('new123');
      const dto = {
        difficulty: 1,
        time: 20,
        portions: 2,
        visibility: 1,
        publications: [{ language: 'en', title: 'New', description: 'Desc' }],
      };

      const mockUser = { id: 'user123' } as any;
      const result = await controller.create(dto, mockUser);

      expect(result).toBe('new123');
      expect(mockService.create).toHaveBeenCalledWith(dto, 'user123');
    });
  });

  describe('update', () => {
    it('should update recipe', async () => {
      const dto = {
        difficulty: 1,
        time: 20,
        portions: 2,
        visibility: 1,
        publications: [{ language: 'en', title: 'Updated', description: 'Desc' }],
      };

      const mockUser = { id: 'user123' } as any;
      await controller.update('rec123', dto, mockUser);

      expect(mockService.update).toHaveBeenCalledWith('rec123', dto, 'user123');
    });
  });

  describe('addIngredients', () => {
    it('should add ingredients to recipe', async () => {
      const ingredients = [{ id: 'ing1', unitId: null, quantity: 100, isOptional: false }];

      await controller.addIngredients('rec123', ingredients);

      expect(mockService.addIngredients).toHaveBeenCalledWith('rec123', ingredients);
    });
  });

  describe('addKitchenware', () => {
    it('should add kitchenware to recipe', async () => {
      const kitchenware = [{ id: 'kit1', quantity: 1 }];

      await controller.addKitchenware('rec123', kitchenware);

      expect(mockService.addKitchenware).toHaveBeenCalledWith('rec123', kitchenware);
    });
  });

  describe('addSteps', () => {
    it('should add steps to recipe', async () => {
      const steps = [{ number: 1, content: [{ language: 'en', title: 'Step 1', body: 'Do something' }] }];

      await controller.addSteps('rec123', steps);

      expect(mockService.addSteps).toHaveBeenCalledWith('rec123', steps);
    });
  });
});

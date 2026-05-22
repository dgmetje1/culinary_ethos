import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecipeRepository } from './recipe.repository';

describe('RecipeRepository', () => {
  let repository: RecipeRepository;
  let mockTypeOrmRepo: any;

  const createMockEntity = (overrides = {}) => ({
    id: 'rec123',
    uniqueId: 'unique123',
    difficulty: 2,
    time: 30,
    portions: 4,
    visibility: 1,
    author: 'chef123',
    thumbnailUrl: 'http://example.com/image.jpg',
    headerImg: null,
    publicationDate: new Date('2024-01-01'),
    publications: [
      { language: 'en', title: 'Chocolate Cake', description: 'Delicious' },
    ],
    steps: [],
    ingredients: [],
    kitchenware: [],
    categoryIds: ['cat1'],
    ...overrides,
  });

  beforeEach(() => {
    mockTypeOrmRepo = {
      find: vi.fn(),
      findOne: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };
    repository = new RecipeRepository(mockTypeOrmRepo);
  });

  describe('findAll', () => {
    it('should return all recipes ordered by publicationDate desc', async () => {
      const entities = [createMockEntity()];
      mockTypeOrmRepo.find.mockResolvedValue(entities);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('rec123');
      expect(mockTypeOrmRepo.find).toHaveBeenCalledWith({
        take: 20,
        order: { publicationDate: 'DESC' },
      });
    });

    it('should return empty array when none exist', async () => {
      mockTypeOrmRepo.find.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return recipe when found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(createMockEntity());

      const result = await repository.findById('rec123');

      expect(result).not.toBeNull();
      expect(result!.id).toBe('rec123');
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('invalid');

      expect(result).toBeNull();
    });
  });

  describe('findDaily', () => {
    it('should return most recent recipe', async () => {
      const entities = [createMockEntity()];
      mockTypeOrmRepo.find.mockResolvedValue(entities);

      const result = await repository.findDaily();

      expect(result).not.toBeNull();
      expect(result!.id).toBe('rec123');
    });

    it('should return null when no recipes exist', async () => {
      mockTypeOrmRepo.find.mockResolvedValue([]);

      const result = await repository.findDaily();

      expect(result).toBeNull();
    });
  });

  describe('exists', () => {
    it('should return true when recipe exists', async () => {
      mockTypeOrmRepo.count.mockResolvedValue(1);

      const result = await repository.exists('rec123');

      expect(result).toBe(true);
      expect(mockTypeOrmRepo.count).toHaveBeenCalledWith({ where: { id: 'rec123' } });
    });

    it('should return false when recipe does not exist', async () => {
      mockTypeOrmRepo.count.mockResolvedValue(0);

      const result = await repository.exists('invalid');

      expect(result).toBe(false);
    });
  });

  describe('create', () => {
    it('should create and return recipe', async () => {
      const entity = createMockEntity();
      mockTypeOrmRepo.create.mockReturnValue(entity);
      mockTypeOrmRepo.save.mockResolvedValue(entity);

      const result = await repository.create({
        difficulty: 2,
        time: 30,
        portions: 4,
        visibility: 1,
        author: 'chef123',
        publications: [{ language: 'en', title: 'Chocolate Cake', description: 'Delicious' }],
        categoryIds: ['cat1'],
        ingredients: [],
        kitchenware: [],
        steps: [],
      });

      expect(result.id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update recipe when found', async () => {
      const entity = createMockEntity();
      mockTypeOrmRepo.findOne.mockResolvedValue(entity);
      mockTypeOrmRepo.save.mockResolvedValue(entity);

      const result = await repository.update('rec123', { difficulty: 3 } as any);

      expect(result).toBe(true);
    });

    it('should return false when recipe not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.update('invalid', {} as any);

      expect(result).toBe(false);
    });
  });

  describe('addIngredients', () => {
    it('should add ingredients to recipe', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(createMockEntity());
      mockTypeOrmRepo.update.mockResolvedValue({ affected: 1 });

      const result = await repository.addIngredients('rec123', [
        { id: 'ing1', unitId: null, quantity: 100, isOptional: false },
      ]);

      expect(result).toBe(true);
    });

    it('should return false when recipe not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.addIngredients('invalid', []);

      expect(result).toBe(false);
    });
  });

  describe('addKitchenware', () => {
    it('should add kitchenware to recipe', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(createMockEntity());
      mockTypeOrmRepo.update.mockResolvedValue({ affected: 1 });

      const result = await repository.addKitchenware('rec123', [
        { id: 'kit1', quantity: 1 },
      ]);

      expect(result).toBe(true);
    });

    it('should return false when recipe not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.addKitchenware('invalid', []);

      expect(result).toBe(false);
    });
  });

  describe('addSteps', () => {
    it('should add steps to recipe', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(createMockEntity());
      mockTypeOrmRepo.update.mockResolvedValue({ affected: 1 });

      const result = await repository.addSteps('rec123', [
        { number: 1, content: [{ language: 'en', title: 'Step 1', body: 'Do it' }] },
      ]);

      expect(result).toBe(true);
    });

    it('should return false when recipe not found', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.addSteps('invalid', []);

      expect(result).toBe(false);
    });
  });
});

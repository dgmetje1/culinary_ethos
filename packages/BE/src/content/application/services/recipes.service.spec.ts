import { describe, it, expect, beforeEach, vi } from "vitest";
import { RecipesService } from "./recipes.service";
import { EntityNotFoundError, InvalidParameterError } from "../../../common/exceptions";

describe("RecipesService", () => {
  let service: RecipesService;
  let mockRecipeRepository: any;
  let mockCategoryRepository: any;
  let mockIngredientRepository: any;
  let mockKitchenwareRepository: any;
  let mockUnitRepository: any;
  let mockEventEmitter: any;

  const mockRecipe = {
    id: "rec123",
    difficulty: 2,
    time: 30,
    portions: 4,
    visibility: 1,
    author: "chef123",
    uniqueId: "unique123",
    thumbnailUrl: "http://example.com/image.jpg",
    headerImg: null,
    publicationDate: new Date("2024-01-01"),
    publications: [
      { language: "en", title: "Chocolate Cake", description: "Delicious cake" },
      { language: "es", title: "Pastel de Chocolate", description: "Delicioso pastel" },
    ],
    steps: [],
    ingredients: [],
    kitchenware: [],
    categoryIds: ["cat1"],
  };

  beforeEach(() => {
    mockRecipeRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findDaily: vi.fn(),
      exists: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      addIngredients: vi.fn(),
      addKitchenware: vi.fn(),
      addSteps: vi.fn(),
    };
    mockCategoryRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByIds: vi.fn(),
    };
    mockIngredientRepository = {
      findById: vi.fn(),
      findByIds: vi.fn(),
    };
    mockKitchenwareRepository = {
      findById: vi.fn(),
      findByIds: vi.fn(),
    };
    mockUnitRepository = {
      findById: vi.fn(),
    };
    mockEventEmitter = {
      emit: vi.fn(),
    };
    service = new RecipesService(
      mockRecipeRepository,
      mockCategoryRepository,
      mockIngredientRepository,
      mockKitchenwareRepository,
      mockUnitRepository,
      mockEventEmitter,
    );
  });

  describe("getAll", () => {
    it("should return all recipes", async () => {
      mockRecipeRepository.findAll.mockResolvedValue([mockRecipe]);
      mockCategoryRepository.findAll.mockResolvedValue([]);

      const result = await service.getAll(undefined, "en");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("rec123");
      expect(result[0].title).toBe("Chocolate Cake");
    });

    it("should return empty array when no recipes", async () => {
      mockRecipeRepository.findAll.mockResolvedValue([]);
      mockCategoryRepository.findAll.mockResolvedValue([]);

      const result = await service.getAll(undefined, "en");

      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should return recipe by id", async () => {
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);
      mockCategoryRepository.findByIds.mockResolvedValue([]);
      mockIngredientRepository.findByIds.mockResolvedValue([]);
      mockKitchenwareRepository.findByIds.mockResolvedValue([]);
      mockUnitRepository.findById.mockResolvedValue(null);

      const result = await service.getById("rec123");

      expect(result.id).toBe("rec123");
      expect(result.title).toBe("Chocolate Cake");
    });

    it("should throw EntityNotFoundError when recipe not found", async () => {
      mockRecipeRepository.findById.mockResolvedValue(null);

      await expect(service.getById("invalid")).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("getDaily", () => {
    it("should return daily recipe", async () => {
      mockRecipeRepository.findDaily.mockResolvedValue(mockRecipe);

      const result = await service.getDaily();

      expect(result.id).toBe("rec123");
    });

    it("should throw EntityNotFoundError when no daily recipe", async () => {
      mockRecipeRepository.findDaily.mockResolvedValue(null);

      await expect(service.getDaily()).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("create", () => {
    it("should create recipe and return id", async () => {
      mockRecipeRepository.create.mockResolvedValue({ ...mockRecipe, id: "new123" });

      const result = await service.create(
        {
          difficulty: 1,
          time: 20,
          portions: 2,
          visibility: 1,
          publications: [{ language: "en", title: "New Recipe", description: "Desc" }],
        },
        "chef",
      );

      expect(result).toBe("new123");
      expect(mockRecipeRepository.create).toHaveBeenCalled();
    });

    it("should throw InvalidParameterError when publications is empty", async () => {
      await expect(
        service.create(
          {
            difficulty: 1,
            time: 20,
            portions: 2,
            visibility: 1,
            publications: [],
          },
          "chef",
        ),
      ).rejects.toThrow(InvalidParameterError);
    });
  });

  describe("addIngredients", () => {
    it("should add ingredients to recipe", async () => {
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);
      mockRecipeRepository.addIngredients.mockResolvedValue(mockRecipe);

      await service.addIngredients("rec123", [
        { id: "ing1", unitId: "unit1", quantity: 100, isOptional: false },
      ]);

      expect(mockRecipeRepository.addIngredients).toHaveBeenCalledWith("rec123", [
        { id: "ing1", unitId: "unit1", quantity: 100, isOptional: false },
      ]);
    });

    it("should throw EntityNotFoundError when recipe not found", async () => {
      mockRecipeRepository.findById.mockResolvedValue(null);

      await expect(service.addIngredients("invalid", [])).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("addKitchenware", () => {
    it("should add kitchenware to recipe", async () => {
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);
      mockRecipeRepository.addKitchenware.mockResolvedValue(mockRecipe);

      await service.addKitchenware("rec123", [{ id: "kit1", quantity: 1 }]);

      expect(mockRecipeRepository.addKitchenware).toHaveBeenCalledWith("rec123", [
        { id: "kit1", quantity: 1 },
      ]);
    });
  });

  describe("addSteps", () => {
    it("should add steps to recipe", async () => {
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);
      mockRecipeRepository.addSteps.mockResolvedValue(mockRecipe);

      await service.addSteps("rec123", [
        { number: 1, content: [{ language: "en", title: "Step 1", body: "Do something" }] },
      ]);

      expect(mockRecipeRepository.addSteps).toHaveBeenCalled();
    });
  });
});

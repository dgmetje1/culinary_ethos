import { describe, it, expect, beforeEach, vi } from "vitest";
import { MealPlanRepository } from "./meal-plan.repository";

describe("MealPlanRepository", () => {
  let repository: MealPlanRepository;
  let mockTypeOrmRepo: any;

  const mockEntity = {
    id: "plan123",
    weekStart: "2024-01-01",
    entries: [{ id: "e1", day: 1, mealType: "breakfast", recipeId: "r1", recipeTitle: "Pancakes" }],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  const expectedAttributes = {
    id: "plan123",
    weekStart: "2024-01-01",
    entries: [{ id: "e1", day: 1, mealType: "breakfast", recipeId: "r1", recipeTitle: "Pancakes" }],
    createdAt: mockEntity.createdAt,
    updatedAt: mockEntity.updatedAt,
  };

  beforeEach(() => {
    mockTypeOrmRepo = {
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
    repository = new MealPlanRepository(mockTypeOrmRepo);
  });

  describe("findByWeekStart", () => {
    it("should return meal plan when found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findByWeekStart("2024-01-01");

      expect(result).toEqual(expectedAttributes);
      expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({ where: { weekStart: "2024-01-01" } });
    });

    it("should return null when not found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByWeekStart("invalid");

      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should return meal plan by id", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById("plan123");

      expect(result).toEqual(expectedAttributes);
    });

    it("should return null when not found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById("invalid");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create and return meal plan", async () => {
      const createdEntity = { ...mockEntity, id: "new-id" };
      mockTypeOrmRepo.create.mockReturnValue(createdEntity);
      mockTypeOrmRepo.save.mockResolvedValue(createdEntity);

      const result = await repository.create({
        weekStart: "2024-01-01",
        entries: [
          { id: "e1", day: 1, mealType: "breakfast", recipeId: "r1", recipeTitle: "Pancakes" },
        ],
      });

      expect(result.id).toBeDefined();
      expect(mockTypeOrmRepo.save).toHaveBeenCalled();
    });

    it("should create with empty entries", async () => {
      const emptyEntity = { ...mockEntity, entries: [] };
      mockTypeOrmRepo.create.mockReturnValue(emptyEntity);
      mockTypeOrmRepo.save.mockResolvedValue(emptyEntity);

      const result = await repository.create({ weekStart: "2024-01-15" });

      expect(result.entries).toEqual([]);
    });
  });

  describe("update", () => {
    it("should update entries when found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);
      mockTypeOrmRepo.save.mockResolvedValue({ ...mockEntity, entries: [] });

      const result = await repository.update("plan123", []);

      expect(result).toEqual({ ...expectedAttributes, entries: [] });
    });

    it("should return null when not found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.update("invalid", []);

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should return true when deleted", async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.delete("plan123");

      expect(result).toBe(true);
    });

    it("should return false when nothing deleted", async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 0 });

      const result = await repository.delete("invalid");

      expect(result).toBe(false);
    });
  });
});

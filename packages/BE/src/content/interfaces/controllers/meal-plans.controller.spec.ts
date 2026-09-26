import { describe, it, expect, beforeEach, vi } from "vitest";
import { MealPlansController } from "./meal-plans.controller";

describe("MealPlansController", () => {
  let controller: MealPlansController;
  let mockService: any;

  const mockPlan = {
    id: "plan123",
    weekStart: "2024-01-01",
    entries: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  beforeEach(() => {
    mockService = {
      getByWeekStart: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    controller = new MealPlansController(mockService);
  });

  describe("getByWeekStart", () => {
    it("should return meal plan by week start", async () => {
      mockService.getByWeekStart.mockResolvedValue(mockPlan);

      const result = await controller.getByWeekStart("2024-01-01");

      expect(result).toEqual(mockPlan);
      expect(mockService.getByWeekStart).toHaveBeenCalledWith("2024-01-01");
    });

    it("should return null when not found", async () => {
      mockService.getByWeekStart.mockResolvedValue(null);

      const result = await controller.getByWeekStart("2024-99-99");

      expect(result).toBeNull();
    });
  });

  describe("getById", () => {
    it("should return meal plan by id", async () => {
      mockService.getById.mockResolvedValue(mockPlan);

      const result = await controller.getById("plan123");

      expect(result).toEqual(mockPlan);
    });
  });

  describe("create", () => {
    it("should create meal plan", async () => {
      mockService.create.mockResolvedValue(mockPlan);
      const dto = { weekStart: "2024-01-01", entries: [] };

      const result = await controller.create(dto);

      expect(result).toEqual(mockPlan);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe("update", () => {
    it("should update meal plan", async () => {
      const updated = {
        ...mockPlan,
        entries: [{ id: "e1", day: 1, mealType: "lunch", recipeId: "r1", recipeTitle: "Soup" }],
      };
      mockService.update.mockResolvedValue(updated);
      const dto = {
        entries: [{ id: "e1", day: 1, mealType: "lunch", recipeId: "r1", recipeTitle: "Soup" }],
      };

      const result = await controller.update("plan123", dto);

      expect(result).toEqual(updated);
      expect(mockService.update).toHaveBeenCalledWith("plan123", dto);
    });
  });

  describe("delete", () => {
    it("should delete meal plan", async () => {
      await controller.delete("plan123");

      expect(mockService.delete).toHaveBeenCalledWith("plan123");
    });
  });
});

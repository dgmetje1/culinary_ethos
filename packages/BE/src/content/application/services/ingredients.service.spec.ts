import { describe, it, expect, beforeEach, vi } from "vitest";
import { IngredientsService } from "./ingredients.service";
import { EntityNotFoundError, InvalidParameterError } from "../../../common/exceptions";

describe("IngredientsService", () => {
  let service: IngredientsService;
  let mockRepository: any;

  const mockIngredient = {
    id: "ing123",
    content: [
      { language: "en", name: "Sugar", singularName: "Sugar" },
      { language: "es", name: "Azúcar", singularName: "Azúcar" },
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
    service = new IngredientsService(mockRepository);
  });

  describe("getAll", () => {
    it("should return all ingredients", async () => {
      mockRepository.findAll.mockResolvedValue([mockIngredient]);

      const result = await service.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("ing123");
    });
  });

  describe("create", () => {
    it("should create ingredient successfully", async () => {
      mockRepository.create.mockResolvedValue(mockIngredient);

      await service.create({
        content: [{ language: "en", name: "Sugar", singularName: "Sugar" }],
      });

      expect(mockRepository.create).toHaveBeenCalled();
    });

    it("should throw InvalidParameterError when content is empty", async () => {
      await expect(service.create({ content: [] })).rejects.toThrow(InvalidParameterError);
    });
  });

  describe("update", () => {
    it("should update ingredient successfully", async () => {
      mockRepository.findById.mockResolvedValue(mockIngredient);
      mockRepository.update.mockResolvedValue(mockIngredient);

      await service.update({
        id: "ing123",
        content: [{ language: "en", name: "Updated Sugar", singularName: "Sugar" }],
      });

      expect(mockRepository.update).toHaveBeenCalled();
    });

    it("should throw EntityNotFoundError when ingredient not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update({
          id: "invalid",
          content: [{ language: "en", name: "Updated", singularName: "Updated" }],
        }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("delete", () => {
    it("should delete ingredient successfully", async () => {
      mockRepository.findById.mockResolvedValue(mockIngredient);
      mockRepository.delete.mockResolvedValue(true);

      await service.delete("ing123");

      expect(mockRepository.delete).toHaveBeenCalledWith("ing123");
    });

    it("should throw EntityNotFoundError when ingredient not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete("invalid")).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("merge", () => {
    it("should merge ingredients successfully", async () => {
      mockRepository.findById.mockResolvedValue(mockIngredient);
      mockRepository.merge.mockResolvedValue(true);

      await service.merge({
        targetId: "ing123",
        ingredientIds: ["ing456", "ing789"],
      });

      expect(mockRepository.merge).toHaveBeenCalledWith("ing123", ["ing456", "ing789"]);
    });

    it("should throw EntityNotFoundError when target not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.merge({
          targetId: "invalid",
          ingredientIds: ["ing456"],
        }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });
});

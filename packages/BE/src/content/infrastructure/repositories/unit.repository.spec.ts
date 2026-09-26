import { describe, it, expect, beforeEach, vi } from "vitest";
import { UnitRepository } from "./unit.repository";

describe("UnitRepository", () => {
  let repository: UnitRepository;
  let mockTypeOrmRepo: any;

  const mockEntity = {
    id: "unit123",
    isVisible: true,
    content: [{ language: "en", name: "Grams", shortName: "g", singularName: "Gram" }],
  };

  beforeEach(() => {
    mockTypeOrmRepo = {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    repository = new UnitRepository(mockTypeOrmRepo);
  });

  describe("findAll", () => {
    it("should return all units", async () => {
      mockTypeOrmRepo.find.mockResolvedValue([mockEntity]);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: "unit123",
        isVisible: true,
        content: [{ language: "en", name: "Grams", shortName: "g", singularName: "Gram" }],
      });
    });
  });

  describe("findById", () => {
    it("should return unit when found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById("unit123");

      expect(result).toEqual({
        id: "unit123",
        isVisible: true,
        content: [{ language: "en", name: "Grams", shortName: "g", singularName: "Gram" }],
      });
    });

    it("should return null when not found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById("invalid");

      expect(result).toBeNull();
    });
  });

  describe("findByIds", () => {
    it("should return units for ids", async () => {
      mockTypeOrmRepo.find.mockResolvedValue([mockEntity]);

      const result = await repository.findByIds(["unit123"]);

      expect(result).toHaveLength(1);
    });

    it("should return empty for empty ids", async () => {
      const result = await repository.findByIds([]);
      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("should create unit", async () => {
      const created = { ...mockEntity, id: "new-id" };
      mockTypeOrmRepo.create.mockReturnValue(created);
      mockTypeOrmRepo.save.mockResolvedValue(created);

      const result = await repository.create(true, [
        { language: "en", name: "Grams", shortName: "g", singularName: "Gram" },
      ]);

      expect(result.id).toBeDefined();
      expect(result.isVisible).toBe(true);
    });
  });

  describe("update", () => {
    it("should update when found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);
      const newContent = [{ language: "en", name: "KG", shortName: "kg", singularName: "KG" }];

      const result = await repository.update("unit123", false, newContent);

      expect(result).toEqual({ id: "unit123", isVisible: false, content: newContent });
      expect(mockTypeOrmRepo.update).toHaveBeenCalledWith("unit123", {
        isVisible: false,
        content: newContent,
      });
    });

    it("should return null when not found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.update("invalid", true, []);

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should return true when deleted", async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.delete("unit123");

      expect(result).toBe(true);
    });

    it("should return false when nothing deleted", async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 0 });

      const result = await repository.delete("invalid");

      expect(result).toBe(false);
    });
  });
});

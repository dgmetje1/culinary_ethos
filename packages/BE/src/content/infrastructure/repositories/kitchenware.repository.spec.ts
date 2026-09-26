import { describe, it, expect, beforeEach, vi } from "vitest";
import { KitchenwareRepository } from "./kitchenware.repository";

describe("KitchenwareRepository", () => {
  let repository: KitchenwareRepository;
  let mockTypeOrmRepo: any;

  const mockEntity = {
    id: "kit123",
    content: [{ language: "en", name: "Pan", singularName: "Pan" }],
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
    repository = new KitchenwareRepository(mockTypeOrmRepo);
  });

  describe("findAll", () => {
    it("should return all kitchenware", async () => {
      mockTypeOrmRepo.find.mockResolvedValue([mockEntity]);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("kit123");
    });
  });

  describe("findById", () => {
    it("should return kitchenware when found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById("kit123");

      expect(result).toEqual({ id: "kit123", content: mockEntity.content });
    });

    it("should return null when not found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById("invalid");

      expect(result).toBeNull();
    });
  });

  describe("findByIds", () => {
    it("should return kitchenware for ids", async () => {
      mockTypeOrmRepo.find.mockResolvedValue([mockEntity]);

      const result = await repository.findByIds(["kit123"]);

      expect(result).toHaveLength(1);
    });

    it("should return empty for empty ids", async () => {
      const result = await repository.findByIds([]);
      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("should create kitchenware", async () => {
      const created = { ...mockEntity, id: "new-id" };
      mockTypeOrmRepo.create.mockReturnValue(created);
      mockTypeOrmRepo.save.mockResolvedValue(created);

      const result = await repository.create([
        { language: "en", name: "Pan", singularName: "Pan" },
      ]);

      expect(result.id).toBeDefined();
    });
  });

  describe("update", () => {
    it("should update when found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(mockEntity);
      const newContent = [{ language: "en", name: "Updated", singularName: "Updated" }];

      const result = await repository.update("kit123", newContent);

      expect(result).toEqual({ id: "kit123", content: newContent });
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

      const result = await repository.delete("kit123");

      expect(result).toBe(true);
    });

    it("should return false when nothing deleted", async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 0 });

      const result = await repository.delete("invalid");

      expect(result).toBe(false);
    });
  });

  describe("merge", () => {
    it("should merge kitchenware contents", async () => {
      const sourceEntity = {
        id: "kit456",
        content: [{ language: "es", name: "Sartén", singularName: "Sartén" }],
      };
      mockTypeOrmRepo.findOne.mockResolvedValueOnce(mockEntity).mockResolvedValueOnce(sourceEntity);
      mockTypeOrmRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.merge("kit123", ["kit456"]);

      expect(result).toBe(true);
      expect(mockTypeOrmRepo.delete).toHaveBeenCalledWith("kit456");
    });

    it("should return false when target not found", async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.merge("invalid", ["kit456"]);

      expect(result).toBe(false);
    });

    it("should skip duplicate language during merge", async () => {
      const sourceEntity = {
        id: "kit456",
        content: [{ language: "en", name: "Pan", singularName: "Pan" }],
      };
      mockTypeOrmRepo.findOne.mockResolvedValueOnce(mockEntity).mockResolvedValueOnce(sourceEntity);

      const result = await repository.merge("kit123", ["kit456"]);

      expect(result).toBe(true);
      expect(mockTypeOrmRepo.update).toHaveBeenCalledWith("kit123", {
        content: [{ language: "en", name: "Pan", singularName: "Pan" }],
      });
    });
  });
});

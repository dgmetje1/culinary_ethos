import { describe, it, expect, beforeEach, vi } from "vitest";
import { UnitsService } from "./units.service";
import { EntityNotFoundError, InvalidParameterError } from "../../../common/exceptions";

describe("UnitsService", () => {
  let service: UnitsService;
  let mockRepository: any;

  const mockUnit = {
    id: "unit123",
    isVisible: true,
    content: [
      { language: "en", name: "Grams", shortName: "g", singularName: "Gram" },
      { language: "es", name: "Gramos", shortName: "g", singularName: "Gramo" },
    ],
  };

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    service = new UnitsService(mockRepository);
  });

  describe("getAll", () => {
    it("should return all units", async () => {
      mockRepository.findAll.mockResolvedValue([mockUnit]);

      const result = await service.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("unit123");
      expect(result[0].isVisible).toBe(true);
    });
  });

  describe("create", () => {
    it("should create unit successfully", async () => {
      mockRepository.create.mockResolvedValue(mockUnit);

      await service.create({
        isVisible: true,
        content: [{ language: "en", name: "Grams", shortName: "g", singularName: "Gram" }],
      });

      expect(mockRepository.create).toHaveBeenCalledWith(true, [
        { language: "en", name: "Grams", shortName: "g", singularName: "Gram" },
      ]);
    });

    it("should throw InvalidParameterError when content is empty", async () => {
      await expect(service.create({ isVisible: true, content: [] })).rejects.toThrow(
        InvalidParameterError,
      );
    });
  });

  describe("update", () => {
    it("should update unit successfully", async () => {
      mockRepository.findById.mockResolvedValue(mockUnit);
      mockRepository.update.mockResolvedValue({ ...mockUnit, isVisible: false });

      await service.update({
        id: "unit123",
        isVisible: false,
        content: [{ language: "en", name: "Grams", shortName: "g", singularName: "Gram" }],
      });

      expect(mockRepository.update).toHaveBeenCalled();
    });

    it("should throw EntityNotFoundError when unit not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update({
          id: "invalid",
          isVisible: true,
          content: [{ language: "en", name: "Grams", shortName: "g", singularName: "Gram" }],
        }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("delete", () => {
    it("should delete unit successfully", async () => {
      mockRepository.findById.mockResolvedValue(mockUnit);
      mockRepository.delete.mockResolvedValue(true);

      await service.delete("unit123");

      expect(mockRepository.delete).toHaveBeenCalledWith("unit123");
    });

    it("should throw EntityNotFoundError when unit not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete("invalid")).rejects.toThrow(EntityNotFoundError);
    });
  });
});

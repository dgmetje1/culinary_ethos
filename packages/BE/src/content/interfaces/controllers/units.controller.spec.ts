import { describe, it, expect, beforeEach, vi } from "vitest";
import { UnitsController } from "./units.controller";

describe("UnitsController", () => {
  let controller: UnitsController;
  let mockService: any;

  const mockUnits = [
    {
      id: "unit123",
      isVisible: true,
      content: { en: { name: "Grams", shortName: "g", singularName: "Gram" } },
    },
  ];

  beforeEach(() => {
    mockService = {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    controller = new UnitsController(mockService);
  });

  describe("getAll", () => {
    it("should return all units", async () => {
      mockService.getAll.mockResolvedValue(mockUnits);

      const result = await controller.getAll();

      expect(result).toEqual(mockUnits);
    });
  });

  describe("create", () => {
    it("should create a unit", async () => {
      const dto = {
        isVisible: true,
        content: [{ language: "en", name: "Grams", shortName: "g", singularName: "Gram" }],
      };

      await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe("update", () => {
    it("should update a unit", async () => {
      const dto = {
        id: "unit123",
        isVisible: false,
        content: [{ language: "en", name: "Grams", shortName: "g", singularName: "Gram" }],
      };

      await controller.update(dto);

      expect(mockService.update).toHaveBeenCalledWith(dto);
    });
  });

  describe("delete", () => {
    it("should delete a unit", async () => {
      await controller.delete("unit123");

      expect(mockService.delete).toHaveBeenCalledWith("unit123");
    });
  });
});

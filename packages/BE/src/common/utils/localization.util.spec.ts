import { describe, it, expect } from "vitest";
import { LocalizationHelper } from "./localization.util";

describe("LocalizationHelper", () => {
  const publications = [
    { language: "en", title: "Chocolate Cake", description: "Delicious cake" },
    {
      language: "es",
      title: "Pastel de Chocolate",
      description: "Delicioso pastel",
    },
  ];

  const content = [
    {
      language: "en",
      name: "Sugar",
      singularName: "Sugar",
      description: "Sweet",
    },
    {
      language: "es",
      name: "Azúcar",
      singularName: "Azúcar",
      description: "Dulce",
    },
  ];

  describe("getLocalizedContent", () => {
    it("should get content for requested language", () => {
      const result = LocalizationHelper.getLocalizedContent(content, "name", "en");
      expect(result).toBe("Sugar");
    });

    it("should fall back to first language when requested language not found", () => {
      const result = LocalizationHelper.getLocalizedContent(content, "name", "fr");
      expect(result).toBe("Sugar");
    });

    it("should return empty string when content is undefined", () => {
      const result = LocalizationHelper.getLocalizedContent(undefined, "name" as any, "en");
      expect(result).toBe("");
    });

    it("should return empty string when content is empty array", () => {
      const result = LocalizationHelper.getLocalizedContent([], "name" as any, "en");
      expect(result).toBe("");
    });

    it("should get singularName field", () => {
      const result = LocalizationHelper.getLocalizedContent(content, "singularName", "es");
      expect(result).toBe("Azúcar");
    });

    it("should return empty string when key does not exist on found item", () => {
      const result = LocalizationHelper.getLocalizedContent(content, "nonexistent" as any, "en");
      expect(result).toBe("");
    });
  });

  describe("getPublicationTitle", () => {
    it("should get title for requested language", () => {
      const result = LocalizationHelper.getPublicationTitle(publications, "en");
      expect(result).toBe("Chocolate Cake");
    });

    it("should fall back to first language when requested language not found", () => {
      const result = LocalizationHelper.getPublicationTitle(publications, "fr");
      expect(result).toBe("Chocolate Cake");
    });

    it("should return empty string when publications is empty", () => {
      const result = LocalizationHelper.getPublicationTitle([], "en");
      expect(result).toBe("");
    });
  });

  describe("getPublicationDescription", () => {
    it("should get description for requested language", () => {
      const result = LocalizationHelper.getPublicationDescription(publications, "en");
      expect(result).toBe("Delicious cake");
    });

    it("should fall back to first language when requested language not found", () => {
      const result = LocalizationHelper.getPublicationDescription(publications, "fr");
      expect(result).toBe("Delicious cake");
    });

    it("should return empty string when publications is empty", () => {
      const result = LocalizationHelper.getPublicationDescription([], "en");
      expect(result).toBe("");
    });
  });

  describe("mapContentToRecord", () => {
    it("should map content array to record keyed by language", () => {
      const result = LocalizationHelper.mapContentToRecord(content, (item) => ({
        name: item.name,
        singularName: item.singularName,
      }));
      expect(result).toEqual({
        en: { name: "Sugar", singularName: "Sugar" },
        es: { name: "Azúcar", singularName: "Azúcar" },
      });
    });

    it("should return empty object for empty content array", () => {
      const result = LocalizationHelper.mapContentToRecord([], (_item) => ({}));
      expect(result).toEqual({});
    });
  });
});

export class LocalizationHelper {
  static getLocalizedContent<T extends { language: string }>(
    content: T[] | undefined,
    key: keyof T,
    language: string,
  ): string {
    if (!content) return "";
    const localized = content.find((c) => c.language === language);
    const fallback = content[0];
    return (localized?.[key] as string) || (fallback?.[key] as string) || "";
  }

  static getPublicationTitle(
    publications: { language: string; title: string }[],
    language: string,
  ): string {
    const pub = publications.find((p) => p.language === language);
    return pub?.title || publications[0]?.title || "";
  }

  static getPublicationDescription(
    publications: { language: string; description: string }[],
    language: string,
  ): string {
    const pub = publications.find((p) => p.language === language);
    return pub?.description || publications[0]?.description || "";
  }

  static mapContentToRecord<T extends { language: string }>(
    content: T[],
    keyMapping: (item: T) => Record<string, unknown>,
  ): Record<string, Record<string, unknown>> {
    const result: Record<string, Record<string, unknown>> = {};
    content.forEach((c) => {
      result[c.language] = keyMapping(c);
    });
    return result;
  }
}

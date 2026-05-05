import { Language } from "./user";

export type Category = {
  id: string;
  content: Record<Language, CategoryTranslatableContent>;
};

export type CategoryTranslatableContent = { name: string; description: string };

export type CategoriesDTO = Array<Category>;

export type CategoryCreateDTO = Omit<Category, "id">;
export type CategoryEditDTO = Category;

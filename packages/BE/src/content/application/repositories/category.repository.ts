import { CategoryAttributes, CategoryContent } from "../../domain/models";

export const CATEGORY_REPOSITORY = "CATEGORY_REPOSITORY";

export interface ICategoryRepository {
  findAll(): Promise<CategoryAttributes[]>;
  findById(id: string): Promise<CategoryAttributes | null>;
  findByIds(ids: string[]): Promise<CategoryAttributes[]>;
  create(content: CategoryContent[]): Promise<CategoryAttributes>;
  update(id: string, content: CategoryContent[]): Promise<CategoryAttributes | null>;
  delete(id: string): Promise<boolean>;
}

import { CategoryAttributes, CategoryContent } from '../../domain/models';

export interface ICategoryRepository {
  findAll(): Promise<CategoryAttributes[]>;
  findById(id: string): Promise<CategoryAttributes | null>;
  create(content: CategoryContent[]): Promise<CategoryAttributes>;
  update(id: string, content: CategoryContent[]): Promise<CategoryAttributes | null>;
  delete(id: string): Promise<boolean>;
}
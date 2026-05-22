import { IngredientAttributes, IngredientContent } from '../../domain/models';

export const INGREDIENT_REPOSITORY = 'INGREDIENT_REPOSITORY';

export interface IIngredientRepository {
  findAll(): Promise<IngredientAttributes[]>;
  findById(id: string): Promise<IngredientAttributes | null>;
  findByIds(ids: string[]): Promise<IngredientAttributes[]>;
  create(content: IngredientContent[]): Promise<IngredientAttributes>;
  update(id: string, content: IngredientContent[]): Promise<IngredientAttributes | null>;
  delete(id: string): Promise<boolean>;
  merge(targetId: string, ingredientIds: string[]): Promise<boolean>;
}
import {
  RecipeAttributes,
  RecipePublication,
  RecipeStep,
  RecipeIngredient,
  RecipeKitchenware,
  CreateRecipeInput,
} from '../../domain/models';

export type { CreateRecipeInput };

export const RECIPE_REPOSITORY = 'RECIPE_REPOSITORY';

export interface IRecipeRepository {
  findAll(categoryId?: number): Promise<RecipeAttributes[]>;
  findByAuthor(authorId: string): Promise<RecipeAttributes[]>;
  findAllAdmin(status?: string): Promise<RecipeAttributes[]>;
  findById(id: string): Promise<RecipeAttributes | null>;
  findByIds(ids: string[]): Promise<RecipeAttributes[]>;
  findDaily(): Promise<RecipeAttributes | null>;
  exists(id: string): Promise<boolean>;
  create(input: CreateRecipeInput): Promise<RecipeAttributes>;
  update(id: string, input: Partial<CreateRecipeInput>): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  countByStatus(status: string): Promise<number>;
  countAll(): Promise<number>;
  addIngredients(id: string, ingredients: RecipeIngredient[]): Promise<boolean>;
  addKitchenware(id: string, kitchenware: RecipeKitchenware[]): Promise<boolean>;
  addSteps(id: string, steps: RecipeStep[]): Promise<boolean>;
}
import {
  RecipeAttributes,
  RecipePublication,
  RecipeStep,
  RecipeIngredient,
  RecipeKitchenware,
} from '../../domain/models';

export interface CreateRecipeInput {
  difficulty: number;
  time: number;
  portions: number;
  visibility: number;
  author: string;
  publications: RecipePublication[];
  categoryIds: string[];
  ingredients: RecipeIngredient[];
  kitchenware: RecipeKitchenware[];
  steps: RecipeStep[];
}

export interface IRecipeRepository {
  findAll(categoryId?: number): Promise<RecipeAttributes[]>;
  findById(id: string): Promise<RecipeAttributes | null>;
  findDaily(): Promise<RecipeAttributes | null>;
  create(input: CreateRecipeInput): Promise<RecipeAttributes>;
  addIngredients(id: string, ingredients: RecipeIngredient[]): Promise<RecipeAttributes | null>;
  addKitchenware(id: string, kitchenware: RecipeKitchenware[]): Promise<RecipeAttributes | null>;
  addSteps(id: string, steps: RecipeStep[]): Promise<RecipeAttributes | null>;
}
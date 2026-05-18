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
  thumbnailUrl?: string;
  headerImg?: string;
}

export interface IRecipeRepository {
  findAll(categoryId?: number): Promise<RecipeAttributes[]>;
  findById(id: string): Promise<RecipeAttributes | null>;
  findDaily(): Promise<RecipeAttributes | null>;
  exists(id: string): Promise<boolean>;
  create(input: CreateRecipeInput): Promise<RecipeAttributes>;
  update(id: string, input: Partial<CreateRecipeInput>): Promise<boolean>;
  addIngredients(id: string, ingredients: RecipeIngredient[]): Promise<boolean>;
  addKitchenware(id: string, kitchenware: RecipeKitchenware[]): Promise<boolean>;
  addSteps(id: string, steps: RecipeStep[]): Promise<boolean>;
}
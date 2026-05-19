import { Language } from "@/types/user";

export interface RecipePublicationDTO {
  language: Language;
  title: string;
  description: string;
}

export interface RecipeStepContentDTO {
  language: Language;
  title: string;
  body: string;
}

export interface RecipeStepDTO {
  number: number;
  content: RecipeStepContentDTO[];
  imageUrl?: string;
}

export interface RecipeIngredientDTO {
  id: string;
  unitId: string | null;
  quantity: number;
  isOptional: boolean;
}

export interface RecipeKitchenwareDTO {
  id: string;
  quantity: number;
}

export interface CreateRecipeDTO {
  difficulty: number;
  time: number;
  portions: number;
  visibility: number;
  author: string;
  thumbnailUrl?: string;
  headerImg?: string;
  publications: RecipePublicationDTO[];
  categories?: string[];
  ingredients?: RecipeIngredientDTO[];
  kitchenware?: RecipeKitchenwareDTO[];
  steps?: RecipeStepDTO[];
}

export interface RecipeIngredientFormData {
  ingredientId: string;
  unitId: string | null;
  quantity: number;
  isOptional: boolean;
  name: string;
}

export interface RecipeKitchenwareFormData {
  kitchenwareId: string;
  quantity: number;
  name: string;
}

export interface RecipeCategoryFormData {
  categoryId: string;
  name: string;
}
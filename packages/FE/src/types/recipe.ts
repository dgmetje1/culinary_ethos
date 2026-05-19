import { Category } from "./category";
import { Ingredient } from "./ingredients";
import { Unit } from "./unit";
import { Language } from "./user";

export enum RecipeDifficulty {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}

export type Recipe = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  headerImg: string;
  uniqueId: string;
  language: string;
  difficulty: RecipeDifficulty;
  time: number;
  portions: number;
  visibility: number;
  author: string;
  publicationDate: Date;
  categories: RecipeCategory[];
  ingredients: RecipeIngredient[];
  kitchenware: RecipeKitchenware[];
  steps: RecipeStep[];
};

export type RecipeCategory = Pick<Category, "id"> & Unit["content"][Language];
export type RecipeIngredient = Pick<Ingredient, "id"> &
  Ingredient["content"][Language] & {
    quantity: number;
    optional: boolean;
    unit: Pick<Unit, "id" | "isVisible"> & Unit["content"][Language] | null;
  };

export type RecipeKitchenware = {
  id: string;
  name: string;
  singularName: string;
  quantity: number;
};

export type RecipeStep = {
  id: string;
  title: string;
  body: string;
  number: number;
  imageUrl?: string;
};

export type RecipeListItem = Pick<Recipe, "id" | "title" | "thumbnailUrl" | "time" | "author" | "categories">;

export type RecipeList = Array<RecipeListItem>;

export type DailyRecipe = Pick<
  Recipe,
  | "id"
  | "title"
  | "thumbnailUrl"
  | "time"
  | "author"
  | "publicationDate"
  | "difficulty"
  | "portions"
  | "categories"
  | "ingredients"
>;

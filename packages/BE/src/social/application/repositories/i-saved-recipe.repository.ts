import { SavedRecipeAttributes } from "../../domain/models/saved-recipe.entity";

export const SAVED_RECIPE_REPOSITORY = "SAVED_RECIPE_REPOSITORY";

export interface ISavedRecipeRepository {
  findByUser(userId: string): Promise<SavedRecipeAttributes[]>;
  findOne(userId: string, recipeId: string): Promise<SavedRecipeAttributes | null>;
  create(userId: string, recipeId: string): Promise<SavedRecipeAttributes>;
  delete(id: string): Promise<boolean>;
  countByRecipe(recipeId: string): Promise<number>;
}

import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { SAVED_RECIPE_REPOSITORY, ISavedRecipeRepository } from '../repositories/i-saved-recipe.repository';
import { RECIPE_REPOSITORY, IRecipeRepository } from '../../../content/application/repositories/recipe.repository';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../content/application/repositories/category.repository';
import { RecipeListItemResponseDto } from '../../../content/application/dto';
import { RecipeAttributes, CategoryAttributes } from '../../../content/domain/models';

@Injectable()
export class SavedRecipesService {
  constructor(
    @Inject(SAVED_RECIPE_REPOSITORY)
    private readonly savedRecipeRepository: ISavedRecipeRepository,
    @Inject(RECIPE_REPOSITORY)
    private readonly recipeRepository: IRecipeRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async save(userId: string, recipeId: string): Promise<{ id: string }> {
    const existing = await this.savedRecipeRepository.findOne(userId, recipeId);
    if (existing) {
      throw new ConflictException('Recipe already saved');
    }
    const saved = await this.savedRecipeRepository.create(userId, recipeId);
    return { id: saved.id };
  }

  async unsave(userId: string, recipeId: string): Promise<void> {
    const existing = await this.savedRecipeRepository.findOne(userId, recipeId);
    if (!existing) {
      throw new NotFoundException('Saved recipe not found');
    }
    await this.savedRecipeRepository.delete(existing.id);
  }

  async isSaved(userId: string, recipeId: string): Promise<{ saved: boolean }> {
    const existing = await this.savedRecipeRepository.findOne(userId, recipeId);
    return { saved: !!existing };
  }

  async getSavedRecipeIds(userId: string): Promise<{ recipeId: string; savedAt: Date }[]> {
    const saved = await this.savedRecipeRepository.findByUser(userId);
    return saved.map((s) => ({ recipeId: s.recipeId, savedAt: s.createdAt }));
  }

  async getSavedCount(recipeId: string): Promise<{ count: number }> {
    const count = await this.savedRecipeRepository.countByRecipe(recipeId);
    return { count };
  }

  async getSavedRecipes(userId: string, language: string = 'en'): Promise<RecipeListItemResponseDto[]> {
    const saved = await this.savedRecipeRepository.findByUser(userId);
    if (!saved.length) return [];

    const recipeIds = saved.map((s) => s.recipeId);
    const [recipes, allCategories] = await Promise.all([
      this.recipeRepository.findByIds(recipeIds),
      this.categoryRepository.findAll(),
    ]);

    const recipeMap = new Map(recipes.map((r) => [r.id, r]));
    const savedAtMap = new Map(saved.map((s) => [s.recipeId, s.createdAt]));

    return saved
      .filter((s) => recipeMap.has(s.recipeId))
      .map((s) => {
        const recipe = recipeMap.get(s.recipeId)!;
        return this.mapToListItem(recipe, language, savedAtMap.get(s.recipeId)!, allCategories);
      });
  }

  private mapToListItem(
    recipe: RecipeAttributes,
    language: string,
    savedAt: Date,
    allCategories: CategoryAttributes[],
  ): RecipeListItemResponseDto {
    return {
      id: recipe.id,
      title: this.getPublicationTitle(recipe.publications, language),
      categories: (recipe.categoryIds ?? []).reduce<{ id: string; name: string }[]>(
        (acc, catId) => {
          const cat = allCategories.find(
            (c) =>
              c.id === catId &&
              c.content.some((content) => content.language === language),
          );
          if (cat) {
            const content =
              cat.content.find((c) => c.language === language) ||
              cat.content[0];
            acc.push({ id: cat.id, name: content?.name || '' });
          }
          return acc;
        },
        [],
      ),
      time: recipe.time,
      author: recipe.author,
      thumbnailUrl: recipe.thumbnailUrl,
      portions: recipe.portions,
      savedAt,
    };
  }

  private getPublicationTitle(
    publications: { language: string; title: string }[],
    language: string,
  ): string {
    const pub = publications.find((p) => p.language === language) || publications[0];
    return pub?.title || '';
  }
}

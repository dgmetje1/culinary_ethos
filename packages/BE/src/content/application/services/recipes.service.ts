import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { EntityNotFoundError, InvalidParameterError } from '../../../common/exceptions';
import {
  CreateRecipeDto,
  RecipeResponseDto,
  RecipeListItemResponseDto,
  RecipeDailyResponseDto,
} from '../dto';
import { RecipeAttributes } from '../../domain/models/recipe.types';
import { RECIPE_REPOSITORY, IRecipeRepository, CreateRecipeInput } from '../repositories/recipe.repository';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repositories/category.repository';
import { INGREDIENT_REPOSITORY, IIngredientRepository } from '../repositories/ingredient.repository';
import { KITCHENWARE_REPOSITORY, IKitchenwareRepository } from '../repositories/kitchenware.repository';
import { UNIT_REPOSITORY, IUnitRepository } from '../repositories/unit.repository';
import { LocalizationHelper } from '../../../common/utils/localization.util';
import {
  CategoryAttributes,
  IngredientAttributes,
  KitchenwareAttributes,
  UnitAttributes,
} from '../../domain/models';

@Injectable()
export class RecipesService {
  constructor(
    @Inject(RECIPE_REPOSITORY) private readonly recipeRepository: IRecipeRepository,
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    @Inject(INGREDIENT_REPOSITORY) private readonly ingredientRepository: IIngredientRepository,
    @Inject(KITCHENWARE_REPOSITORY) private readonly kitchenwareRepository: IKitchenwareRepository,
    @Inject(UNIT_REPOSITORY) private readonly unitRepository: IUnitRepository,
  ) {}

  private getPublicationTitle = LocalizationHelper.getPublicationTitle;
  private getPublicationDescription = LocalizationHelper.getPublicationDescription;

  async getAll(
    categoryId?: number,
    language: string = 'en',
  ): Promise<RecipeListItemResponseDto[]> {
    const recipes = await this.recipeRepository.findAll(categoryId);

    const categories = await this.categoryRepository.findAll();

    return recipes.map((r) => this.mapToListItem(r, language, categories));
  }

  async getByUser(
    userId: string,
    language: string = 'en',
  ): Promise<RecipeListItemResponseDto[]> {
    const recipes = await this.recipeRepository.findByAuthor(userId);

    const categories = await this.categoryRepository.findAll();

    return recipes.map((r) => this.mapToListItem(r, language, categories));
  }

  private mapToListItem(
    r: RecipeAttributes,
    language: string,
    allCategories?: CategoryAttributes[],
  ): RecipeListItemResponseDto {
    const categories = allCategories ?? [];
    return {
      id: r.id,
      title: this.getPublicationTitle(r.publications, language),
      categories: r.categoryIds.reduce<{ id: string; name: string }[]>(
        (acc, catId) => {
          const cat = categories.find(
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
      time: r.time,
      author: r.author,
      thumbnailUrl: r.thumbnailUrl,
      portions: r.portions,
    };
  }

  async getAllAdmin(
    status?: string,
    language: string = 'en',
  ): Promise<RecipeResponseDto[]> {
    const recipes = await this.recipeRepository.findAllAdmin(status);
    return Promise.all(
      recipes.map((r) => this.mapToFullResponse(r, language)),
    );
  }

  async approve(
    id: string,
    reviewedBy: string = 'admin',
    language: string = 'en',
  ): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }
    if (recipe.status !== 'flagged') {
      throw new InvalidParameterError('Only flagged recipes can be approved', 'Recipe');
    }
    await this.recipeRepository.update(id, {
      status: 'approved',
      reviewedBy,
      reviewedAt: new Date(),
    });
    const updated = await this.recipeRepository.findById(id);
    return this.mapToFullResponse(updated!, language);
  }

  async reject(
    id: string,
    reviewedBy: string = 'admin',
    language: string = 'en',
  ): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }
    if (recipe.status !== 'flagged') {
      throw new InvalidParameterError('Only flagged recipes can be rejected', 'Recipe');
    }
    await this.recipeRepository.update(id, {
      status: 'banned',
      reviewedBy,
      reviewedAt: new Date(),
    });
    const updated = await this.recipeRepository.findById(id);
    return this.mapToFullResponse(updated!, language);
  }

  async flag(
    id: string,
    language: string = 'en',
  ): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }
    if (recipe.status !== 'published') {
      throw new InvalidParameterError('Only published recipes can be flagged', 'Recipe');
    }
    await this.recipeRepository.update(id, {
      status: 'flagged',
    });
    const updated = await this.recipeRepository.findById(id);
    return this.mapToFullResponse(updated!, language);
  }

  private async mapToFullResponse(
    recipe: RecipeAttributes,
    language: string,
  ): Promise<RecipeResponseDto> {
    const [categoryMap, ingredientMap, kitchenwareMap] =
      await this.getRelatedEntitiesMaps(recipe);

    return {
      id: recipe.id,
      title: this.getPublicationTitle(recipe.publications, language),
      description: this.getPublicationDescription(
        recipe.publications,
        language,
      ),
      thumbnailUrl: recipe.thumbnailUrl,
      headerImg: recipe.headerImg,
      difficulty: recipe.difficulty,
      time: recipe.time,
      portions: recipe.portions,
      visibility: recipe.visibility,
      author: recipe.author,
      publicationDate: recipe.publicationDate,
      categories: this.mapCategories(recipe.categoryIds, categoryMap, language),
      ingredients: await this.mapIngredients(
        recipe.ingredients,
        ingredientMap,
        language,
      ),
      kitchenware: this.mapKitchenware(
        recipe.kitchenware,
        kitchenwareMap,
        language,
      ),
      steps: this.mapSteps(recipe.steps, language),
      status: recipe.status,
      reviewedBy: recipe.reviewedBy,
      reviewedAt: recipe.reviewedAt,
    };
  }

  async getById(
    id: string,
    language: string = 'en',
  ): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }
    return this.mapToFullResponse(recipe, language);
  }

  private async getRelatedEntitiesMaps(recipe: {
    categoryIds: string[];
    ingredients: { id: string }[];
    kitchenware: { id: string }[];
  }) {
    const ingredientIds = recipe.ingredients.map((ri) => ri.id);
    const kitchenwareIds = recipe.kitchenware.map((rk) => rk.id);

    const [categories, ingredientsData, kitchenwareData] = await Promise.all([
      this.categoryRepository.findByIds(recipe.categoryIds),
      this.ingredientRepository.findByIds(ingredientIds),
      this.kitchenwareRepository.findByIds(kitchenwareIds),
    ]);

    return [
      new Map<string, CategoryAttributes>(categories.map((c) => [c.id, c])),
      new Map<string, IngredientAttributes>(
        ingredientsData.map((i) => [i.id, i]),
      ),
      new Map<string, KitchenwareAttributes>(
        kitchenwareData.map((k) => [k.id, k]),
      ),
    ] as const;
  }

  private mapCategories(
    categoryIds: string[],
    categoryMap: Map<string, CategoryAttributes>,
    language: string,
  ) {
    return categoryIds
      .map((catId) => categoryMap.get(catId))
      .filter((cat): cat is CategoryAttributes => cat !== undefined)
      .map((cat) => ({
        id: cat.id,
        name: this.getLocalizedContent(cat.content, 'name', language),
      }));
  }

  private async mapIngredients(
    ingredients: {
      id: string;
      unitId: string | null;
      quantity: number;
      isOptional: boolean;
    }[],
    ingredientMap: Map<string, IngredientAttributes>,
    language: string,
  ) {
    return Promise.all(
      ingredients.map(async (ri) => {
        const ing = ingredientMap.get(ri.id);
        return {
          id: ri.id,
          name: this.getLocalizedContent(ing?.content, 'name', language),
          singularName: this.getLocalizedContent(
            ing?.content,
            'singularName',
            language,
          ),
          quantity: ri.quantity,
          optional: ri.isOptional,
          unit: await this.getUnitResponse(ri.unitId, language),
        };
      }),
    );
  }

  private mapKitchenware(
    kitchenware: { id: string; quantity: number }[],
    kitchenwareMap: Map<string, KitchenwareAttributes>,
    language: string,
  ) {
    return kitchenware.map((rk) => {
      const kw = kitchenwareMap.get(rk.id);
      return {
        id: rk.id,
        name: this.getLocalizedContent(kw?.content, 'name', language),
        singularName: this.getLocalizedContent(
          kw?.content,
          'singularName',
          language,
        ),
        quantity: rk.quantity,
      };
    });
  }

  private mapSteps(
    steps: {
      number: number;
      content: { language: string; title: string; body: string }[];
      imageUrl?: string;
    }[],
    language: string,
  ) {
    return steps.map((step, index) => ({
      id: String(index + 1),
      title:
        this.getLocalizedContent(step.content, 'title', language) ||
        `Step ${index + 1}`,
      body: this.getLocalizedContent(step.content, 'body', language),
      number: step.number,
      imageUrl: step.imageUrl,
    }));
  }

  private async getUnitResponse(unitId: string | null, language: string) {
    if (!unitId) return null;
    const u = await this.unitRepository.findById(unitId);
    if (!u) return null;
    return {
      id: u.id,
      name: this.getLocalizedContent(u.content, 'name', language),
      shortName: this.getLocalizedContent(u.content, 'shortName', language),
    };
  }

  private getLocalizedContent = LocalizationHelper.getLocalizedContent;

  async getDaily(): Promise<RecipeDailyResponseDto> {
    const recipe = await this.recipeRepository.findDaily();
    if (!recipe) {
      throw new EntityNotFoundError('Daily recipe not found', 'Recipe');
    }
    return {
      id: recipe.id,
      title: this.getPublicationTitle(recipe.publications, 'en'),
      thumbnailUrl: recipe.thumbnailUrl,
      time: recipe.time,
      author: recipe.author,
      publicationDate: recipe.publicationDate,
      difficulty: recipe.difficulty,
      portions: recipe.portions,
      categories: [],
      ingredients: [],
    };
  }

  async create(dto: CreateRecipeDto, authorId: string): Promise<string> {
    if (!dto.publications || dto.publications.length === 0) {
      throw new InvalidParameterError('Publications are required', 'Recipe');
    }
    const input: CreateRecipeInput = {
      difficulty: dto.difficulty || 0,
      time: dto.time || 0,
      portions: dto.portions || 0,
      visibility: dto.visibility || 0,
      author: authorId,
      publications: dto.publications,
      categoryIds: dto.categories || [],
      ingredients: dto.ingredients || [],
      kitchenware: dto.kitchenware || [],
      steps: dto.steps || [],
      thumbnailUrl: dto.thumbnailUrl,
      headerImg: dto.headerImg,
    };
    const result = await this.recipeRepository.create(input);
    return result.id;
  }

  async update(id: string, dto: CreateRecipeDto, userId: string): Promise<string> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }

    if (recipe.status === 'banned') {
      throw new ForbiddenException('Cannot edit a banned recipe');
    }

    const input: Partial<CreateRecipeInput> = {
      difficulty: dto.difficulty,
      time: dto.time,
      portions: dto.portions,
      visibility: dto.visibility,
      author: userId,
      publications: dto.publications,
      categoryIds: dto.categories || [],
      ingredients: dto.ingredients || [],
      kitchenware: dto.kitchenware || [],
      steps: dto.steps || [],
      thumbnailUrl: dto.thumbnailUrl,
      headerImg: dto.headerImg,
      status: recipe.status === 'approved' || recipe.status === 'flagged' ? 'published' : recipe.status,
    };

    await this.recipeRepository.update(id, input);
    return id;
  }

  async delete(id: string): Promise<void> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }
    await this.recipeRepository.delete(id);
  }

  async addIngredients(
    id: string,
    ingredients: {
      id: string;
      unitId: string | null;
      quantity: number;
      isOptional: boolean;
    }[],
  ): Promise<void> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }
    await this.recipeRepository.addIngredients(id, ingredients);
  }

  async addKitchenware(
    id: string,
    kitchenware: { id: string; quantity: number }[],
  ): Promise<void> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }
    await this.recipeRepository.addKitchenware(id, kitchenware);
  }

  async addSteps(
    id: string,
    steps: {
      number: number;
      content: { language: string; title: string; body: string }[];
    }[],
  ): Promise<void> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }
    await this.recipeRepository.addSteps(id, steps);
  }
}

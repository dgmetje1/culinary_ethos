import { Injectable } from '@nestjs/common';
import { CreateRecipeInput } from '../repositories/recipe.repository';
import {
  EntityNotFoundError,
  InvalidParameterError,
} from '../../../common/exceptions';
import {
  CreateRecipeDto,
  RecipeResponseDto,
  RecipeListItemResponseDto,
  RecipeDailyResponseDto,
} from '../dto';
import {
  CategoryRepository,
  RecipeRepository,
  IngredientRepository,
  KitchenwareRepository,
  UnitRepository,
} from '../../infrastructure';
import {
  CategoryAttributes,
  IngredientAttributes,
  KitchenwareAttributes,
  UnitAttributes,
} from '../../domain/models';

@Injectable()
export class RecipesService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly ingredientRepository: IngredientRepository,
    private readonly kitchenwareRepository: KitchenwareRepository,
    private readonly unitRepository: UnitRepository,
  ) {}

  private getPublicationTitle(
    publications: { language: string; title: string }[],
    language: string,
  ): string {
    const pub = publications.find((p) => p.language === language);
    return pub?.title || publications[0]?.title || '';
  }

  private getPublicationDescription(
    publications: { language: string; description: string }[],
    language: string,
  ): string {
    const pub = publications.find((p) => p.language === language);
    return pub?.description || publications[0]?.description || '';
  }

  async getAll(
    categoryId?: number,
    language: string = 'en',
  ): Promise<RecipeListItemResponseDto[]> {
    const recipes = await this.recipeRepository.findAll(categoryId);

    const categories = await this.categoryRepository.findAll();

    return recipes.map((r) => ({
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
    }));
  }

  async getById(
    id: string,
    language: string = 'en',
  ): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }

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
    };
  }

  private async getRelatedEntitiesMaps(recipe: {
    categoryIds: string[];
    ingredients: { id: string }[];
    kitchenware: { id: string }[];
  }) {
    const [categories, ingredientsData, kitchenwareData] = await Promise.all([
      this.categoryRepository.findByIds(recipe.categoryIds),
      Promise.all(
        recipe.ingredients.map((ri) =>
          this.ingredientRepository.findById(ri.id),
        ),
      ),
      Promise.all(
        recipe.kitchenware.map((rk) =>
          this.kitchenwareRepository.findById(rk.id),
        ),
      ),
    ]);

    return [
      new Map<string, CategoryAttributes>(categories.map((c) => [c.id, c])),
      new Map<string, IngredientAttributes>(
        ingredientsData
          .filter((i): i is IngredientAttributes => i !== null)
          .map((i) => [i.id, i]),
      ),
      new Map<string, KitchenwareAttributes>(
        kitchenwareData
          .filter((k): k is KitchenwareAttributes => k !== null)
          .map((k) => [k.id, k]),
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

  private getLocalizedContent<T extends { language: string }>(
    content: T[] | undefined,
    key: keyof T,
    language: string,
  ): string {
    if (!content) return '';
    const localized = content.find((c) => c.language === language);
    const fallback = content[0];
    return (localized?.[key] as string) || (fallback?.[key] as string) || '';
  }

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

  async create(dto: CreateRecipeDto): Promise<string> {
    if (!dto.publications || dto.publications.length === 0) {
      throw new InvalidParameterError('Publications are required', 'Recipe');
    }
    const input: CreateRecipeInput = {
      difficulty: dto.difficulty || 0,
      time: dto.time || 0,
      portions: dto.portions || 0,
      visibility: dto.visibility || 0,
      author: dto.author,
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

  async update(id: string, dto: CreateRecipeDto): Promise<string> {
    const exists = await this.recipeRepository.exists(id);
    if (!exists) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }

    const input: Partial<CreateRecipeInput> = {
      difficulty: dto.difficulty,
      time: dto.time,
      portions: dto.portions,
      visibility: dto.visibility,
      author: dto.author,
      publications: dto.publications,
      categoryIds: dto.categories || [],
      ingredients: dto.ingredients || [],
      kitchenware: dto.kitchenware || [],
      steps: dto.steps || [],
      thumbnailUrl: dto.thumbnailUrl,
      headerImg: dto.headerImg,
    };

    await this.recipeRepository.update(id, input);
    return id;
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

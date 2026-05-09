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
import { CategoryRepository, RecipeRepository } from '../../infrastructure';

@Injectable()
export class RecipesService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly categoryRepository: CategoryRepository,
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

  async getAll(categoryId?: number, language: string = 'en'): Promise<RecipeListItemResponseDto[]> {
    const recipes = await this.recipeRepository.findAll(categoryId);

    const categories = await this.categoryRepository.findAll();

    return recipes.map((r) => ({
      id: r.id,
      title: this.getPublicationTitle(r.publications, language),
      categories: r.categoryIds.reduce<{ id: string; name: string }[]>((acc, catId) => {
        const cat = categories.find(
          (c) =>
            c.id === catId &&
            c.content.some((content) => content.language === language),
        );
        if (cat) {
          const content = cat.content.find((c) => c.language === language) || cat.content[0];
          acc.push({ id: cat.id, name: content?.name || '' });
        }
        return acc;
      }, []),
      time: r.time,
      author: r.author,
      thumbnailUrl: r.thumbnailUrl,
    }));
  }

  async getById(id: string): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundError('Recipe not found', 'Recipe', [{ id }]);
    }
    return {
      id: recipe.id,
      title: this.getPublicationTitle(recipe.publications, 'en'),
      description: this.getPublicationDescription(recipe.publications, 'en'),
      thumbnailUrl: recipe.thumbnailUrl,
      headerImg: recipe.headerImg,
      difficulty: recipe.difficulty,
      time: recipe.time,
      portions: recipe.portions,
      visibility: recipe.visibility,
      author: recipe.author,
      publicationDate: recipe.publicationDate,
      categories: [],
      ingredients: [],
    };
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
    };
    const result = await this.recipeRepository.create(input);
    return result.id;
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

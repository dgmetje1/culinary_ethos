import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulidx';
import {
  Recipe,
  RecipeAttributes,
  CreateRecipeInput,
  RecipeStep,
  RecipeIngredient,
  RecipeKitchenware,
} from '../../domain/models';
import { IRecipeRepository } from '../../application/repositories/recipe.repository';

@Injectable()
export class RecipeRepository implements IRecipeRepository {
  constructor(
    @InjectRepository(Recipe)
    private readonly repository: Repository<Recipe>,
  ) {}

  async findAll(_categoryId?: number): Promise<RecipeAttributes[]> {
    const results = await this.repository.find({
      take: 20,
      order: { publicationDate: 'DESC' },
    });
    return results.map((r) => this.toAttributes(r));
  }

  async findById(id: string): Promise<RecipeAttributes | null> {
    const result = await this.repository.findOne({ where: { id } });
    return result ? this.toAttributes(result) : null;
  }

  async findDaily(): Promise<RecipeAttributes | null> {
    const results = await this.repository.find({
      order: { publicationDate: 'DESC' },
      take: 1,
    });
    return results.length > 0 ? this.toAttributes(results[0]) : null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async create(input: CreateRecipeInput): Promise<RecipeAttributes> {
    const recipe = this.repository.create({
      id: ulid(),
      uniqueId: ulid(),
      ...input,
    });
    const saved = await this.repository.save(recipe);
    return this.toAttributes(saved as Recipe);
  }

  async update(
    id: string,
    input: Partial<CreateRecipeInput>,
  ): Promise<boolean> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) return false;

    Object.assign(existing, input);
    const saved = await this.repository.save(existing);
    return !!saved;
  }

  async addIngredients(
    id: string,
    ingredients: RecipeIngredient[],
  ): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;
    const updated = [...existing.ingredients, ...ingredients];
    const result = await this.repository.update(id, { ingredients: updated });
    return (result.affected ?? 0) > 0;
  }

  async addKitchenware(
    id: string,
    kitchenware: RecipeKitchenware[],
  ): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;
    const updated = [...existing.kitchenware, ...kitchenware];
    const result = await this.repository.update(id, { kitchenware: updated });
    return (result.affected ?? 0) > 0;
  }

  async addSteps(id: string, steps: RecipeStep[]): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;
    const updated = [...existing.steps, ...steps];
    const result = await this.repository.update(id, { steps: updated });
    return (result.affected ?? 0) > 0;
  }

  private toAttributes(recipe: Recipe): RecipeAttributes {
    const categoryIds = recipe.categoryIds ? recipe.categoryIds : [];
    const steps = recipe.steps ? recipe.steps : [];
    const kitchenware = recipe.kitchenware ? recipe.kitchenware : [];
    const ingredients = recipe.ingredients ? recipe.ingredients : [];
    return {
      id: recipe.id,
      difficulty: recipe.difficulty,
      time: recipe.time,
      portions: recipe.portions,
      visibility: recipe.visibility,
      author: recipe.author,
      uniqueId: recipe.uniqueId,
      thumbnailUrl: recipe.thumbnailUrl,
      headerImg: recipe.headerImg,
      publicationDate: recipe.publicationDate,
      publications: recipe.publications,
      steps,
      ingredients,
      kitchenware,
      categoryIds,
    };
  }
}

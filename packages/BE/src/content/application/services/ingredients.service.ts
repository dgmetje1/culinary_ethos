import { Injectable, Inject } from '@nestjs/common';
import {
  EntityNotFoundError,
  InvalidParameterError,
} from '../../../common/exceptions';
import {
  CreateIngredientDto,
  UpdateIngredientDto,
  MergeIngredientDto,
  IngredientResponseDto,
} from '../dto';
import { INGREDIENT_REPOSITORY, IIngredientRepository } from '../repositories/ingredient.repository';

@Injectable()
export class IngredientsService {
  constructor(
    @Inject(INGREDIENT_REPOSITORY) private readonly ingredientRepository: IIngredientRepository,
  ) {}

  private mapToResponse(
    content: { language: string; name: string; singularName: string }[],
  ): Record<string, { name: string; singularName: string }> {
    const result: Record<string, { name: string; singularName: string }> = {};
    content.forEach((c) => {
      result[c.language] = { name: c.name, singularName: c.singularName };
    });
    return result;
  }

  async getAll(): Promise<IngredientResponseDto[]> {
    const ingredients = await this.ingredientRepository.findAll();
    return ingredients.map((i) => ({
      id: i.id,
      content: this.mapToResponse(i.content),
    }));
  }

  async create(dto: CreateIngredientDto): Promise<{ id: string }> {
    if (!dto.content || dto.content.length === 0) {
      throw new InvalidParameterError('Content is required', 'Ingredient');
    }
    const result = await this.ingredientRepository.create(dto.content);
    return { id: result.id };
  }

  async update(dto: UpdateIngredientDto): Promise<void> {
    const existing = await this.ingredientRepository.findById(dto.id);
    if (!existing) {
      throw new EntityNotFoundError('Ingredient not found', 'Ingredient', [
        { id: dto.id },
      ]);
    }
    await this.ingredientRepository.update(dto.id, dto.content);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.ingredientRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Ingredient not found', 'Ingredient', [
        { id },
      ]);
    }
    await this.ingredientRepository.delete(id);
  }

  async merge(dto: MergeIngredientDto): Promise<void> {
    const target = await this.ingredientRepository.findById(dto.targetId);
    if (!target) {
      throw new EntityNotFoundError(
        'Target ingredient not found',
        'Ingredient',
        [{ id: dto.targetId }],
      );
    }
    await this.ingredientRepository.merge(dto.targetId, dto.ingredientIds);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { EntityNotFoundError, InvalidParameterError } from '../../../common/exceptions';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../dto';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../repositories/category.repository';
import { LocalizationHelper } from '../../../common/utils/localization.util';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
  ) {}

  private mapToResponse(content: { language: string; name: string; description: string }[]): Record<string, { name: string; description: string }> {
    const result: Record<string, { name: string; description: string }> = {};
    content.forEach((c) => {
      result[c.language] = { name: c.name, description: c.description };
    });
    return result;
  }

  async getAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map((c) => ({
      id: c.id,
      content: this.mapToResponse(c.content),
    }));
  }

  async create(dto: CreateCategoryDto): Promise<void> {
    if (!dto.content || dto.content.length === 0) {
      throw new InvalidParameterError('Content is required', 'Category');
    }
    await this.categoryRepository.create(dto.content);
  }

  async update(dto: UpdateCategoryDto): Promise<void> {
    const existing = await this.categoryRepository.findById(dto.id);
    if (!existing) {
      throw new EntityNotFoundError('Category not found', 'Category', [{ id: dto.id }]);
    }
    await this.categoryRepository.update(dto.id, dto.content);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Category not found', 'Category', [{ id }]);
    }
    await this.categoryRepository.delete(id);
  }
}
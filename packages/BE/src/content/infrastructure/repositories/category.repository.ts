import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ulid } from 'ulidx';
import { Category, CategoryAttributes, CategoryContent } from '../../domain/models';
import { ICategoryRepository } from '../../application/repositories/category.repository';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async findAll(): Promise<CategoryAttributes[]> {
    const results = await this.repository.find();
    return results.map((r) => ({ id: r.id, content: r.content }));
  }

  async findById(id: string): Promise<CategoryAttributes | null> {
    const result = await this.repository.findOne({ where: { id } });
    return result ? { id: result.id, content: result.content } : null;
  }

  async findByIds(ids: string[]): Promise<CategoryAttributes[]> {
    if (ids.length === 0) return [];
    const results = await this.repository.find({ where: { id: In(ids) } });
    return results.map((r) => ({ id: r.id, content: r.content }));
  }

  async create(content: CategoryContent[]): Promise<CategoryAttributes> {
    const category = this.repository.create({ id: ulid(), content });
    const saved = await this.repository.save(category);
    return { id: saved.id, content: saved.content };
  }

  async update(id: string, content: CategoryContent[]): Promise<CategoryAttributes | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    await this.repository.update(id, { content });
    return { id, content };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
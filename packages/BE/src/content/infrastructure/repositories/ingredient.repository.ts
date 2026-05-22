import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ulid } from 'ulidx';
import { Ingredient, IngredientAttributes, IngredientContent } from '../../domain/models';
import { IIngredientRepository } from '../../application/repositories/ingredient.repository';

@Injectable()
export class IngredientRepository implements IIngredientRepository {
  constructor(
    @InjectRepository(Ingredient)
    private readonly repository: Repository<Ingredient>,
  ) {}

  async findAll(): Promise<IngredientAttributes[]> {
    const results = await this.repository.find();
    return results.map((r) => ({ id: r.id, content: r.content }));
  }

  async findById(id: string): Promise<IngredientAttributes | null> {
    const result = await this.repository.findOne({ where: { id } });
    return result ? { id: result.id, content: result.content } : null;
  }

  async findByIds(ids: string[]): Promise<IngredientAttributes[]> {
    if (ids.length === 0) return [];
    const results = await this.repository.find({ where: { id: In(ids) } });
    return results.map((r) => ({ id: r.id, content: r.content }));
  }

  async create(content: IngredientContent[]): Promise<IngredientAttributes> {
    const ingredient = this.repository.create({ id: ulid(), content });
    const saved = await this.repository.save(ingredient);
    return { id: saved.id, content: saved.content };
  }

  async update(id: string, content: IngredientContent[]): Promise<IngredientAttributes | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    await this.repository.update(id, { content });
    return { id, content };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async merge(targetId: string, ingredientIds: string[]): Promise<boolean> {
    const target = await this.findById(targetId);
    if (!target) return false;

    for (const id of ingredientIds) {
      const source = await this.findById(id);
      if (!source) continue;

      const mergedContent = [...target.content];
      for (const sc of source.content) {
        if (!mergedContent.some((mc) => mc.language === sc.language)) {
          mergedContent.push(sc);
        }
      }
      await this.repository.update(targetId, { content: mergedContent });
      await this.repository.delete(id);
    }
    return true;
  }
}
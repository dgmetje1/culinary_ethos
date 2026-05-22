import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulidx';
import { MealPlan, MealPlanAttributes, MealPlanEntry, CreateMealPlanInput } from '../../domain/models';
import { IMealPlanRepository } from '../../application/repositories/meal-plan.repository';

@Injectable()
export class MealPlanRepository implements IMealPlanRepository {
  constructor(
    @InjectRepository(MealPlan)
    private readonly repository: Repository<MealPlan>,
  ) {}

  async findByWeekStart(weekStart: string): Promise<MealPlanAttributes | null> {
    const result = await this.repository.findOne({ where: { weekStart } });
    return result ? this.toAttributes(result) : null;
  }

  async findById(id: string): Promise<MealPlanAttributes | null> {
    const result = await this.repository.findOne({ where: { id } });
    return result ? this.toAttributes(result) : null;
  }

  async create(input: CreateMealPlanInput): Promise<MealPlanAttributes> {
    const plan = this.repository.create({
      id: ulid(),
      weekStart: input.weekStart,
      entries: input.entries || [],
    });
    const saved = await this.repository.save(plan);
    return this.toAttributes(saved as MealPlan);
  }

  async update(id: string, entries: MealPlanEntry[]): Promise<MealPlanAttributes | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) return null;
    existing.entries = entries;
    const saved = await this.repository.save(existing);
    return this.toAttributes(saved as MealPlan);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toAttributes(plan: MealPlan): MealPlanAttributes {
    return {
      id: plan.id,
      weekStart: plan.weekStart,
      entries: plan.entries || [],
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}

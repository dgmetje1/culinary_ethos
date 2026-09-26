import { Injectable, Inject } from "@nestjs/common";
import { EntityNotFoundError } from "../../../common/exceptions";
import { CreateMealPlanDto, UpdateMealPlanDto, MealPlanResponseDto } from "../dto";
import { MEAL_PLAN_REPOSITORY, IMealPlanRepository } from "../repositories/meal-plan.repository";

@Injectable()
export class MealPlansService {
  constructor(
    @Inject(MEAL_PLAN_REPOSITORY) private readonly mealPlanRepository: IMealPlanRepository,
  ) {}

  async getByWeekStart(weekStart: string): Promise<MealPlanResponseDto | null> {
    const plan = await this.mealPlanRepository.findByWeekStart(weekStart);
    return plan ? this.mapToResponse(plan) : null;
  }

  async getById(id: string): Promise<MealPlanResponseDto> {
    const plan = await this.mealPlanRepository.findById(id);
    if (!plan) {
      throw new EntityNotFoundError("Meal plan not found", "MealPlan", [{ id }]);
    }
    return this.mapToResponse(plan);
  }

  async create(dto: CreateMealPlanDto): Promise<MealPlanResponseDto> {
    const plan = await this.mealPlanRepository.create({
      weekStart: dto.weekStart,
      entries: dto.entries,
    });
    return this.mapToResponse(plan);
  }

  async update(id: string, dto: UpdateMealPlanDto): Promise<MealPlanResponseDto> {
    const updated = await this.mealPlanRepository.update(id, dto.entries);
    if (!updated) {
      throw new EntityNotFoundError("Meal plan not found", "MealPlan", [{ id }]);
    }
    return this.mapToResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.mealPlanRepository.delete(id);
    if (!deleted) {
      throw new EntityNotFoundError("Meal plan not found", "MealPlan", [{ id }]);
    }
  }

  private mapToResponse(plan: {
    id: string;
    weekStart: string;
    entries: {
      id: string;
      day: number;
      mealType: string;
      recipeId: string;
      recipeTitle: string;
      recipeImageUrl?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }): MealPlanResponseDto {
    return {
      id: plan.id,
      weekStart: plan.weekStart,
      entries: plan.entries,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}

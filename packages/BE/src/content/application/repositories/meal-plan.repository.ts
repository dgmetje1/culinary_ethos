import { MealPlanAttributes, MealPlanEntry, CreateMealPlanInput } from '../../domain/models';

export const MEAL_PLAN_REPOSITORY = 'MEAL_PLAN_REPOSITORY';

export interface IMealPlanRepository {
  findByWeekStart(weekStart: string): Promise<MealPlanAttributes | null>;
  findById(id: string): Promise<MealPlanAttributes | null>;
  create(input: CreateMealPlanInput): Promise<MealPlanAttributes>;
  update(id: string, entries: MealPlanEntry[]): Promise<MealPlanAttributes | null>;
  delete(id: string): Promise<boolean>;
}

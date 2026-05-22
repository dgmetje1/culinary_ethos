export interface MealPlanEntry {
  id: string;
  day: number;
  mealType: string;
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl?: string;
}

export interface MealPlanAttributes {
  id: string;
  weekStart: string;
  entries: MealPlanEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMealPlanInput {
  weekStart: string;
  entries?: MealPlanEntry[];
}

import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'meal_plans' })
export class MealPlan {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  weekStart: string;

  @Column({ type: 'jsonb', default: [] })
  entries: MealPlanEntry[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

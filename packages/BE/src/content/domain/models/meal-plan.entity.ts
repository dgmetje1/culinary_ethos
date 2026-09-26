import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { MealPlanEntry } from "./meal-plan.types";

@Entity({ name: "meal_plans" })
export class MealPlan {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Index()
  @Column({ type: "varchar" })
  weekStart: string;

  @Column({ type: "jsonb", default: [] })
  entries: MealPlanEntry[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}

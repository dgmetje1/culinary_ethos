import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
import {
  RecipePublication,
  RecipeStep,
  RecipeIngredient,
  RecipeKitchenware,
} from './recipe.types';

@Entity({ name: 'recipes' })
export class Recipe {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'int', default: 0 })
  difficulty: number;

  @Column({ type: 'int', default: 0 })
  time: number;

  @Column({ type: 'int', default: 0 })
  portions: number;

  @Column({ type: 'int', default: 0 })
  visibility: number;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'varchar', unique: true })
  uniqueId: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  headerImg: string | null;

  @Index()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publicationDate: Date;

  @Column({ type: 'jsonb', default: [] })
  publications: RecipePublication[];

  @Column({ type: 'jsonb', default: [] })
  steps: RecipeStep[];

  @Column({ type: 'jsonb', default: [] })
  ingredients: RecipeIngredient[];

  @Column({ type: 'jsonb', default: [] })
  kitchenware: RecipeKitchenware[];

  @Column({ type: 'simple-array', nullable: true })
  categoryIds: string[];
}
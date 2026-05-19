import { Entity, Column, PrimaryColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Category } from './category.entity';
import { Unit } from './unit.entity';

export interface RecipePublication {
  language: string;
  title: string;
  description: string;
}

export interface RecipeStep {
  number: number;
  content: {
    language: string;
    title: string;
    body: string;
  }[];
  imageUrl?: string;
}

export interface RecipeIngredient {
  id: string;
  unitId: string | null;
  quantity: number;
  isOptional: boolean;
}

export interface RecipeKitchenware {
  id: string;
  quantity: number;
}

export interface RecipeAttributes {
  id: string;
  difficulty: number;
  time: number;
  portions: number;
  visibility: number;
  author: string;
  uniqueId: string;
  thumbnailUrl: string | null;
  headerImg: string | null;
  publicationDate: Date;
  publications: RecipePublication[];
  steps: RecipeStep[];
  ingredients: RecipeIngredient[];
  kitchenware: RecipeKitchenware[];
  categoryIds: string[];
}

export interface CreateRecipeInput {
  difficulty: number;
  time: number;
  portions: number;
  visibility: number;
  author: string;
  publications: RecipePublication[];
  categoryIds: string[];
  ingredients: RecipeIngredient[];
  kitchenware: RecipeKitchenware[];
  steps: RecipeStep[];
  thumbnailUrl?: string;
  headerImg?: string;
}

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
import { Entity, Column, PrimaryColumn } from 'typeorm';

export interface IngredientContent {
  language: string;
  name: string;
  singularName: string;
}

export interface IngredientAttributes {
  id: string;
  content: IngredientContent[];
}

@Entity({ name: 'ingredients' })
export class Ingredient {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'jsonb', default: [] })
  content: IngredientContent[];
}
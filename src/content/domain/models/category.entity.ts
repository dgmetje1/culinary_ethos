import { Entity, Column, PrimaryColumn } from 'typeorm';

export interface CategoryContent {
  language: string;
  name: string;
  description: string;
}

export interface CategoryAttributes {
  id: string;
  content: CategoryContent[];
}

@Entity({ name: 'categories' })
export class Category {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'jsonb', default: [] })
  content: CategoryContent[];
}
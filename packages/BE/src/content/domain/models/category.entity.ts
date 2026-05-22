import { Entity, Column, PrimaryColumn } from 'typeorm';
import { CategoryContent } from './category.types';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'jsonb', default: [] })
  content: CategoryContent[];
}
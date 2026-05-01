import { Entity, Column, PrimaryColumn } from 'typeorm';

export interface KitchenwareContent {
  language: string;
  name: string;
  singularName: string;
}

export interface KitchenwareAttributes {
  id: string;
  content: KitchenwareContent[];
}

@Entity({ name: 'kitchenware' })
export class Kitchenware {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'jsonb', default: [] })
  content: KitchenwareContent[];
}
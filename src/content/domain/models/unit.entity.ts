import { Entity, Column, PrimaryColumn } from 'typeorm';

export interface UnitContent {
  language: string;
  name: string;
  shortName: string;
  singularName: string;
}

export interface UnitAttributes {
  id: string;
  isVisible: boolean;
  content: UnitContent[];
}

@Entity({ name: 'units' })
export class Unit {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ type: 'jsonb', default: [] })
  content: UnitContent[];
}
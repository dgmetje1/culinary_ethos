import { Entity, Column, PrimaryColumn } from 'typeorm';
import { UnitContent } from './unit.types';

@Entity({ name: 'units' })
export class Unit {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ type: 'jsonb', default: [] })
  content: UnitContent[];
}
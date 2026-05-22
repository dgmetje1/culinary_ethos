import { UnitAttributes, UnitContent } from '../../domain/models';

export const UNIT_REPOSITORY = 'UNIT_REPOSITORY';

export interface IUnitRepository {
  findAll(): Promise<UnitAttributes[]>;
  findById(id: string): Promise<UnitAttributes | null>;
  findByIds(ids: string[]): Promise<UnitAttributes[]>;
  create(isVisible: boolean, content: UnitContent[]): Promise<UnitAttributes>;
  update(id: string, isVisible: boolean, content: UnitContent[]): Promise<UnitAttributes | null>;
  delete(id: string): Promise<boolean>;
}
import { UnitAttributes, UnitContent } from '../../domain/models';

export interface IUnitRepository {
  findAll(): Promise<UnitAttributes[]>;
  findById(id: string): Promise<UnitAttributes | null>;
  create(isVisible: boolean, content: UnitContent[]): Promise<UnitAttributes>;
  update(id: string, isVisible: boolean, content: UnitContent[]): Promise<UnitAttributes | null>;
  delete(id: string): Promise<boolean>;
}
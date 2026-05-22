import { KitchenwareAttributes, KitchenwareContent } from '../../domain/models';

export const KITCHENWARE_REPOSITORY = 'KITCHENWARE_REPOSITORY';

export interface IKitchenwareRepository {
  findAll(): Promise<KitchenwareAttributes[]>;
  findById(id: string): Promise<KitchenwareAttributes | null>;
  findByIds(ids: string[]): Promise<KitchenwareAttributes[]>;
  create(content: KitchenwareContent[]): Promise<KitchenwareAttributes>;
  update(id: string, content: KitchenwareContent[]): Promise<KitchenwareAttributes | null>;
  delete(id: string): Promise<boolean>;
  merge(targetId: string, kitchenwareIds: string[]): Promise<boolean>;
}
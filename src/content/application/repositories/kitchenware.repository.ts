import { KitchenwareAttributes, KitchenwareContent } from '../../domain/models';

export interface IKitchenwareRepository {
  findAll(): Promise<KitchenwareAttributes[]>;
  findById(id: string): Promise<KitchenwareAttributes | null>;
  create(content: KitchenwareContent[]): Promise<KitchenwareAttributes>;
  update(id: string, content: KitchenwareContent[]): Promise<KitchenwareAttributes | null>;
  delete(id: string): Promise<boolean>;
  merge(targetId: string, kitchenwareIds: string[]): Promise<boolean>;
}
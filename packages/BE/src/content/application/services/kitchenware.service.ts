import { Injectable } from '@nestjs/common';
import { EntityNotFoundError, InvalidParameterError } from '../../../common/exceptions';
import { CreateKitchenwareDto, UpdateKitchenwareDto, MergeKitchenwareDto, KitchenwareResponseDto } from '../dto';
import { KitchenwareRepository } from '../../infrastructure';

@Injectable()
export class KitchenwareService {
  constructor(private readonly kitchenwareRepository: KitchenwareRepository) {}

  private mapToResponse(content: { language: string; name: string; singularName: string }[]): Record<string, { name: string; singularName: string }> {
    const result: Record<string, { name: string; singularName: string }> = {};
    content.forEach((c) => {
      result[c.language] = { name: c.name, singularName: c.singularName };
    });
    return result;
  }

  async getAll(): Promise<KitchenwareResponseDto[]> {
    const kitchenware = await this.kitchenwareRepository.findAll();
    return kitchenware.map((k) => ({
      id: k.id,
      content: this.mapToResponse(k.content),
    }));
  }

  async create(dto: CreateKitchenwareDto): Promise<{ id: string }> {
    if (!dto.content || dto.content.length === 0) {
      throw new InvalidParameterError('Content is required', 'Kitchenware');
    }
    const result = await this.kitchenwareRepository.create(dto.content);
    return { id: result.id };
  }

  async update(dto: UpdateKitchenwareDto): Promise<void> {
    const existing = await this.kitchenwareRepository.findById(dto.id);
    if (!existing) {
      throw new EntityNotFoundError('Kitchenware not found', 'Kitchenware', [{ id: dto.id }]);
    }
    await this.kitchenwareRepository.update(dto.id, dto.content);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.kitchenwareRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Kitchenware not found', 'Kitchenware', [{ id }]);
    }
    await this.kitchenwareRepository.delete(id);
  }

  async merge(dto: MergeKitchenwareDto): Promise<void> {
    const target = await this.kitchenwareRepository.findById(dto.targetId);
    if (!target) {
      throw new EntityNotFoundError('Target kitchenware not found', 'Kitchenware', [{ id: dto.targetId }]);
    }
    await this.kitchenwareRepository.merge(dto.targetId, dto.kitchenwareIds);
  }
}
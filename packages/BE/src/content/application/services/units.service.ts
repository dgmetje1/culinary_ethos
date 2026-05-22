import { Injectable, Inject } from '@nestjs/common';
import { EntityNotFoundError, InvalidParameterError } from '../../../common/exceptions';
import { CreateUnitDto, UpdateUnitDto, UnitResponseDto } from '../dto';
import { UNIT_REPOSITORY, IUnitRepository } from '../repositories/unit.repository';

@Injectable()
export class UnitsService {
  constructor(
    @Inject(UNIT_REPOSITORY) private readonly unitRepository: IUnitRepository,
  ) {}

  private mapToResponse(content: { language: string; name: string; shortName: string; singularName: string }[]): Record<string, { name: string; shortName: string; singularName: string }> {
    const result: Record<string, { name: string; shortName: string; singularName: string }> = {};
    content.forEach((c) => {
      result[c.language] = { name: c.name, shortName: c.shortName, singularName: c.singularName };
    });
    return result;
  }

  async getAll(): Promise<UnitResponseDto[]> {
    const units = await this.unitRepository.findAll();
    return units.map((u) => ({
      id: u.id,
      isVisible: u.isVisible,
      content: this.mapToResponse(u.content),
    }));
  }

  async create(dto: CreateUnitDto): Promise<void> {
    if (!dto.content || dto.content.length === 0) {
      throw new InvalidParameterError('Content is required', 'Unit');
    }
    await this.unitRepository.create(dto.isVisible, dto.content);
  }

  async update(dto: UpdateUnitDto): Promise<void> {
    const existing = await this.unitRepository.findById(dto.id);
    if (!existing) {
      throw new EntityNotFoundError('Unit not found', 'Unit', [{ id: dto.id }]);
    }
    await this.unitRepository.update(dto.id, dto.isVisible, dto.content);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.unitRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Unit not found', 'Unit', [{ id }]);
    }
    await this.unitRepository.delete(id);
  }
}
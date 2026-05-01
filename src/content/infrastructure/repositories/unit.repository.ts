import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulidx';
import { Unit, UnitAttributes, UnitContent } from '../../domain/models';
import { IUnitRepository } from '../../application/repositories/unit.repository';

@Injectable()
export class UnitRepository implements IUnitRepository {
  constructor(
    @InjectRepository(Unit)
    private readonly repository: Repository<Unit>,
  ) {}

  async findAll(): Promise<UnitAttributes[]> {
    const results = await this.repository.find();
    return results.map((r) => ({ id: r.id, isVisible: r.isVisible, content: r.content }));
  }

  async findById(id: string): Promise<UnitAttributes | null> {
    const result = await this.repository.findOne({ where: { id } });
    return result ? { id: result.id, isVisible: result.isVisible, content: result.content } : null;
  }

  async create(isVisible: boolean, content: UnitContent[]): Promise<UnitAttributes> {
    const unit = this.repository.create({ id: ulid(), isVisible, content });
    const saved = await this.repository.save(unit);
    return { id: saved.id, isVisible: saved.isVisible, content: saved.content };
  }

  async update(id: string, isVisible: boolean, content: UnitContent[]): Promise<UnitAttributes | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    await this.repository.update(id, { isVisible, content });
    return { id, isVisible, content };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
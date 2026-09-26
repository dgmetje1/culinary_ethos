import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { ulid } from "ulidx";
import { Kitchenware, KitchenwareAttributes, KitchenwareContent } from "../../domain/models";
import { IKitchenwareRepository } from "../../application/repositories/kitchenware.repository";

@Injectable()
export class KitchenwareRepository implements IKitchenwareRepository {
  constructor(
    @InjectRepository(Kitchenware)
    private readonly repository: Repository<Kitchenware>,
  ) {}

  async findAll(): Promise<KitchenwareAttributes[]> {
    const results = await this.repository.find();
    return results.map((r) => ({ id: r.id, content: r.content }));
  }

  async findById(id: string): Promise<KitchenwareAttributes | null> {
    const result = await this.repository.findOne({ where: { id } });
    return result ? { id: result.id, content: result.content } : null;
  }

  async findByIds(ids: string[]): Promise<KitchenwareAttributes[]> {
    if (ids.length === 0) return [];
    const results = await this.repository.find({ where: { id: In(ids) } });
    return results.map((r) => ({ id: r.id, content: r.content }));
  }

  async create(content: KitchenwareContent[]): Promise<KitchenwareAttributes> {
    const kitchenware = this.repository.create({ id: ulid(), content });
    const saved = await this.repository.save(kitchenware);
    return { id: saved.id, content: saved.content };
  }

  async update(id: string, content: KitchenwareContent[]): Promise<KitchenwareAttributes | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    await this.repository.update(id, { content });
    return { id, content };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async merge(targetId: string, kitchenwareIds: string[]): Promise<boolean> {
    const target = await this.findById(targetId);
    if (!target) return false;

    for (const id of kitchenwareIds) {
      const source = await this.findById(id);
      if (!source) continue;

      const mergedContent = [...target.content];
      for (const sc of source.content) {
        if (!mergedContent.some((mc) => mc.language === sc.language)) {
          mergedContent.push(sc);
        }
      }
      await this.repository.update(targetId, { content: mergedContent });
      await this.repository.delete(id);
    }
    return true;
  }
}

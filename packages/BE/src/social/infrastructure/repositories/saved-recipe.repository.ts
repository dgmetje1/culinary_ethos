import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ulid } from "ulidx";
import { SavedRecipe, SavedRecipeAttributes } from "../../domain/models/saved-recipe.entity";
import { ISavedRecipeRepository } from "../../application/repositories/i-saved-recipe.repository";

@Injectable()
export class SavedRecipeRepository implements ISavedRecipeRepository {
  constructor(
    @InjectRepository(SavedRecipe)
    private readonly repository: Repository<SavedRecipe>,
  ) {}

  async findByUser(userId: string): Promise<SavedRecipeAttributes[]> {
    const results = await this.repository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
    return results.map((r) => this.toAttributes(r));
  }

  async findOne(userId: string, recipeId: string): Promise<SavedRecipeAttributes | null> {
    const result = await this.repository.findOne({
      where: { userId, recipeId },
    });
    return result ? this.toAttributes(result) : null;
  }

  async create(userId: string, recipeId: string): Promise<SavedRecipeAttributes> {
    const saved = this.repository.create({
      id: ulid(),
      userId,
      recipeId,
    });
    const entity = await this.repository.save(saved);
    return this.toAttributes(entity as SavedRecipe);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async countByRecipe(recipeId: string): Promise<number> {
    return this.repository.count({ where: { recipeId } });
  }

  private toAttributes(entity: SavedRecipe): SavedRecipeAttributes {
    return {
      id: entity.id,
      userId: entity.userId,
      recipeId: entity.recipeId,
      createdAt: entity.createdAt,
    };
  }
}

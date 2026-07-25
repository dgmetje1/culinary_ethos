import { Entity, PrimaryColumn, Column } from 'typeorm';

export interface SavedRecipeAttributes {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: Date;
}

@Entity({ name: 'saved_recipes' })
export class SavedRecipe {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  recipeId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

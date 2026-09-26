import { Entity, Column, PrimaryColumn } from "typeorm";
import { IngredientContent } from "./ingredient.types";

@Entity({ name: "ingredients" })
export class Ingredient {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "jsonb", default: [] })
  content: IngredientContent[];
}

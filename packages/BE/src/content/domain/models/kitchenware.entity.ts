import { Entity, Column, PrimaryColumn } from "typeorm";
import { KitchenwareContent } from "./kitchenware.types";

@Entity({ name: "kitchenware" })
export class Kitchenware {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "jsonb", default: [] })
  content: KitchenwareContent[];
}

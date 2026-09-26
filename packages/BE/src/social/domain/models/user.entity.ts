import { Entity, Column, PrimaryColumn, Unique } from "typeorm";

export interface UserAttributes {
  id: string;
  account_id: string;
  nick_name: string;
  name: string;
  last_name: string;
  email: string;
  language: string;
  profile_picture: string | null;
  description: string | null;
  position: string | null;
  location: string | null;
  role: string;
  status: string;
}

@Entity({ name: "users" })
@Unique(["account_id"])
export class User {
  @PrimaryColumn({ type: "varchar" })
  id!: string;

  @Column({ type: "varchar" })
  account_id!: string;

  @Column({ type: "varchar" })
  nick_name!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  last_name!: string;

  @Column({ type: "varchar" })
  email!: string;

  @Column({ type: "varchar" })
  language!: string;

  @Column({ type: "varchar", nullable: true })
  profile_picture!: string | null;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "varchar", nullable: true })
  position!: string | null;

  @Column({ type: "varchar", nullable: true })
  location!: string | null;

  @Column({ type: "varchar", default: "chef" })
  role!: string;

  @Column({ type: "varchar", default: "active" })
  status!: string;
}

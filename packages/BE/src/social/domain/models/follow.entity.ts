import { Entity, PrimaryColumn, Column } from "typeorm";

export interface FollowAttributes {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

@Entity({ name: "follows" })
export class Follow {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "varchar" })
  followerId: string;

  @Column({ type: "varchar" })
  followingId: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}

import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  actorId: string;

  @Column({ type: 'varchar', nullable: true })
  actorName: string;

  @Column({ type: 'varchar', nullable: true })
  recipeId: string;

  @Column({ type: 'varchar', nullable: true })
  recipeTitle: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

export interface NotificationAttributes {
  id: string;
  userId: string;
  type: string;
  actorId?: string;
  actorName?: string;
  recipeId?: string;
  recipeTitle?: string;
  read: boolean;
  createdAt: Date;
}

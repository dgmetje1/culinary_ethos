import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @Column()
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @Column({ unique: true })
  email!: string;

  @ApiProperty({ example: 30, description: 'User age' })
  @Column()
  age!: number;
}

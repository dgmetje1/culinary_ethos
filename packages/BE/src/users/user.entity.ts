import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: '01KSB2HG9QT802B103JT6E1ZFH', description: 'Unique identifier' })
  @PrimaryColumn({ type: 'varchar' })
  id!: string;

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

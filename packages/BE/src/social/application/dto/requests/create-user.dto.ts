import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty()
  account_id: string;

  @ApiProperty()
  nick_name: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  language: string;

  @ApiProperty({ nullable: true })
  profile_picture?: string;
}
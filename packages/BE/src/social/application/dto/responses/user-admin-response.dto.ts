import { ApiProperty } from '@nestjs/swagger';

export class UserAdminResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  language: string;

  @ApiProperty({ nullable: true })
  profilePicture: string | null;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;
}

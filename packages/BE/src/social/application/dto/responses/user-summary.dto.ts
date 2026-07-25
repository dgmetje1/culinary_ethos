import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ nullable: true })
  profilePicture: string | null;

  @ApiProperty({ nullable: true })
  position: string | null;

  @ApiProperty({ nullable: true })
  location: string | null;
}
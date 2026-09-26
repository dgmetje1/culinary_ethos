import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty } from "class-validator";

export class UploadFileDto {
  @ApiProperty({ enum: ["recipes", "profile"], description: "Category of the file" })
  @IsNotEmpty()
  @IsIn(["recipes", "profile"])
  category: string;
}

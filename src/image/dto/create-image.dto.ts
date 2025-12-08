import { IsNumber, IsString } from 'class-validator';

export class CreateImageDto {
  @IsNumber()
  diaryId: number;

  @IsString()
  imageUrl: string;
}

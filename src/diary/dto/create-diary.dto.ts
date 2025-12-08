import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateDiaryDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  weatherId: number;

  @IsString()
  diaryDate: string;

  @IsArray()
  @IsString({ each: true })
  diaryFeelings: string[];

  @IsString()
  diaryDesc: string;
}

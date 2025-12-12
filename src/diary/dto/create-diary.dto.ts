import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDiaryDto {
  @IsNotEmpty()
  @IsNumber()
  weatherId: number;

  @IsNotEmpty()
  @IsString()
  diaryDate: string;

  @IsArray()
  @IsString({ each: true })
  diaryFeelings: string[];

  @IsNotEmpty()
  @IsString()
  diaryDesc: string;
}

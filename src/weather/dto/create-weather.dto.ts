import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateWeatherDto {
  @IsString()
  weatherName: string;

  @IsString()
  weatherColor: string;

  @IsBoolean()
  isUsed: boolean;

  @IsString()
  promptEmotion: string;

  @IsString()
  promptColor: string;

  @IsString()
  @IsOptional()
  promptAtmosphere: string;
}

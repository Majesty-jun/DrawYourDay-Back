import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('regenerate')
  async regenerateImage(@Body('diaryId') diaryId: number) {
    return await this.imageService.regenerateImage(diaryId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.imageService.findOne(id);
  }
}

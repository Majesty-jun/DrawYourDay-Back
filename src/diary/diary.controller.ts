import { DiaryService } from './diary.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('diary')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get()
  getCalendar() {
    return this.diaryService.findAll();
  }

  @Get(':id')
  getDiary(@Param('id') diaryId: string) {
    return this.diaryService.findOne(+diaryId);
  }

  @Post()
  createDiary(@Body() createDiaryDto: CreateDiaryDto) {
    return this.diaryService.create(createDiaryDto);
  }

  @Delete(':id')
  deleteDiary(@Param('id') diaryId: string) {
    return this.diaryService.delete(+diaryId);
  }

  @Patch(':id')
  updateDiary(
    @Param('id') diaryId: string,
    @Body() updateDiaryDto: UpdateDiaryDto,
  ) {
    return this.diaryService.update(+diaryId, updateDiaryDto);
  }
}

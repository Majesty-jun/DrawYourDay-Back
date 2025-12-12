import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { User } from 'src/user/entities/user.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@Controller('diary')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('/date')
  getCalendar(
    @GetUser() user: User,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.diaryService.findMonthlyDiaries(user, year, month);
  }

  @Get(':id')
  getDiary(@GetUser() user: User, @Param('id', ParseIntPipe) diaryId: number) {
    return this.diaryService.findOne(user, diaryId);
  }

  @Post()
  createDiary(@GetUser() user: User, @Body() createDiaryDto: CreateDiaryDto) {
    return this.diaryService.create(user, createDiaryDto);
  }

  @Delete(':id')
  deleteDiary(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) diaryId: number,
  ) {
    return this.diaryService.delete(user, diaryId);
  }

  @Patch(':id')
  updateDiary(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) diaryId: number,
    @Body() updateDiaryDto: UpdateDiaryDto,
  ) {
    return this.diaryService.update(user, diaryId, updateDiaryDto);
  }
}

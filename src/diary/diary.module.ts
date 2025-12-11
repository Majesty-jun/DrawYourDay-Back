import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Image } from 'src/image/entities/image.entity';
import { ImageService } from '../image/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, Image]), AuthModule],
  providers: [Diary, DiaryService, ImageService],
  controllers: [DiaryController],
})
export class DiaryModule {}

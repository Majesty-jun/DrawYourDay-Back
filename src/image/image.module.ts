import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from './image.controller';
import { Diary } from 'src/diary/entities/diary.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Image, Diary])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}

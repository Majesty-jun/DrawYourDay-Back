import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from 'src/diary/entities/diary.entity';
import { Image } from './entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Diary])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}

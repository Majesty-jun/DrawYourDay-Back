import { Between, Repository } from 'typeorm';
import { Diary } from './entities/diary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ImageService } from 'src/image/image.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Image } from 'src/image/entities/image.entity';
import { Weather } from 'src/weather/entities/weather.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,

    private imageService: ImageService,
  ) {}

  async create(user: User, createDiaryDto: CreateDiaryDto) {
    const newDiary = this.diaryRepository.create({
      ...createDiaryDto,
      userId: user.id,
    });
    const savedDiary = await this.diaryRepository.save(newDiary);

    try {
      const weatherData = await this.weatherRepository.findOne({
        where: { weatherId: createDiaryDto.weatherId },
      });

      const weather = weatherData?.weatherName || 'Sunny';
      const color = weatherData?.promptColor || 'Warm Orange';
      const mood = weatherData?.promptEmotion || 'peaceful';

      const keywords = createDiaryDto.diaryFeelings.join(', ');

      const fixedStyle =
        'Style: impressionist oil pastel drawing, pointillism, grainy texture, vibrant pastel colors, dreamy atmosphere, soft focus.';

      const prompt = `A scene featuring ${keywords}. context: ${createDiaryDto.diaryDesc}. Weather is ${weather}, creating a ${mood} mood. Color palette involves ${color} hues. ${fixedStyle}`;

      if (prompt) {
        const imageUrl = await this.imageService.generateImage(prompt);
        const newImage = this.imageRepository.create({
          diary: savedDiary,
          imageUrl: imageUrl,
          promptText: prompt,
        });

        await this.imageRepository.save(newImage);
      }
    } catch (error) {
      console.error('AI 이미지 생성 실패:', error);
    }

    return this.findOne(user, savedDiary.diaryId);
  }

  findAll() {
    return this.diaryRepository.find();
  }

  findMonthlyDiaries(user: User, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.diaryRepository.find({
      where: {
        diaryDate: Between(startDate, endDate),
        userId: user.id,
      },
      relations: ['images'],
      select: {
        diaryId: true,
        diaryDate: true,
        images: {
          imageUrl: true,
        },
      },
      order: {
        diaryDate: 'ASC',
      },
    });
  }

  async findOne(user: User, diaryId: number) {
    const diary = await this.diaryRepository.findOne({
      where: {
        diaryId,
        userId: user.id,
      },
      relations: ['images'],
    });

    if (!diary) {
      throw new NotFoundException('일기를 찾을 수 없습니다.');
    }

    return diary;
  }

  async update(user: User, diaryId: number, updateDiaryDto: UpdateDiaryDto) {
    await this.findOne(user, diaryId);
    await this.diaryRepository.update(diaryId, updateDiaryDto);
    return this.findOne(user, diaryId);
  }

  async delete(user: User, diaryId: number) {
    await this.findOne(user, diaryId);
    await this.diaryRepository.delete(diaryId);
    return diaryId;
  }
}

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

      const color = weatherData?.promptColor || 'Warm Orange';
      const mood = weatherData?.promptAtmosphere || 'peaceful';

      const keywords = createDiaryDto.diaryFeelings.join(', ');

      const finalPrompt = `
        [Art Style Direction]
        A dreamy abstract impressionist impasto oil painting with thick, textured brushstrokes and soft focus.

        [Subject Matter - Visual Translation]
        Visually interpret the scene and setting described in the "Diary Source" below.
        Translate the objects, location, and actions mentioned in the text directly into painted scenery.
        (e.g., If it mentions a 'bed' or 'room', paint an interior scene. If it mentions 'park' or 'wind', paint an outdoor scene.)

        **Diary Source:** "${createDiaryDto.diaryDesc}"
        **Theme Keywords:** "${keywords}"

        [Atmosphere & Color]
        The overall mood is ${mood}.
        The color palette is dominated by ${color}, blended with colors evoking the feeling of "${keywords}".

        [Handling Figures]
        If human presence is implied by the diary text, render them only as abstract silhouettes or vague brushstrokes blended into the environment. No realistic details or faces.

        [CRITICAL Negative Constraints]
        **DO NOT include any text, letters, words, speech bubbles, or UI elements in the final image.**
        Do not draw realistic people.
      `;
      if (finalPrompt) {
        const imageUrl = await this.imageService.generateImage(finalPrompt);
        const newImage = this.imageRepository.create({
          diary: savedDiary,
          imageUrl: imageUrl,
          promptText: finalPrompt,
        });

        await this.imageRepository.save(newImage);
      }
    } catch (error) {
      console.error('AI 이미지 생성 실패:', error);
    }

    return this.findOne(user, savedDiary.diaryId);
  }

  findAll(user: User) {
    return this.diaryRepository.find({ where: { userId: user.id } });
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

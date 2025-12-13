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
        [Role Definition]
        You are an AI artist creating an abstract impressionist impasto oil painting based on a user's diary entry.

        [BLOCK 1: Scene Context Analysis Rules] (⭐ 여기가 핵심!)
        Before drawing, analyze the "Diary Text" below to determine the setting:
        1.  **Indoor Priority:** If the text explicitly mentions interior elements (e.g., bed, ceiling, room, window from inside, furniture), you MUST depict an INDOOR scene. Do not draw wide landscapes or skies in this case.
        2.  **Outdoor Priority:** If the text explicitly mentions outdoor activities or locations (e.g., picnic, park, street, river, running), you MUST depict an OUTDOOR scene.
        3.  **Ambiguous Case:** If the text focuses only on emotions without spatial cues, choose a setting (abstract landscape or interior) that best fits the mood defined below.

        [BLOCK 2: Diary Source Input]
        **Diary Text:** "${createDiaryDto.diaryDesc}"
        **Keywords/Emotions:** "${keywords}"

        [BLOCK 3: Art Style & Technique Constraints]
        - Style: Abstract impressionist impasto oil painting. Dreamy and artistic.
        - Technique: Thick brushstrokes, palette knife texture, soft focus, ethereal lighting.
        - Figures: If human presence is inferred from the text, render them as abstract silhouettes or rough brushstrokes blended into the scenery. DO NOT draw realistic faces or detailed bodies.

        [BLOCK 4: Mood & Color Palette]
        - Atmosphere Goal: ${mood}.
        - Color Dominance: ${color}, mixed with colors representing the keywords.
        - Final Touches: Focus on emotional depth and texture over realism.
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

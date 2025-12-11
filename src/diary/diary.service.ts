import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Diary } from './entities/diary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Image } from 'src/image/entities/image.entity';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    private imageService: ImageService,
  ) {}

  async create(createDiaryDto: CreateDiaryDto) {
    const newDiary = this.diaryRepository.create(createDiaryDto);
    const savedDiary = await this.diaryRepository.save(newDiary);

    try {
      const prompt = createDiaryDto.diaryDesc;

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

    return this.findOne(savedDiary.diaryId);
  }

  findAll() {
    return this.diaryRepository.find();
  }

  findMonthlyDiaries(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.diaryRepository.find({
      where: {
        diaryDate: Between(startDate, endDate),
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

  findOne(diaryId: number) {
    return this.diaryRepository.findOne({
      where: { diaryId },
      relations: ['images'],
    });
  }

  async update(diaryId: number, updateDiaryDto: UpdateDiaryDto) {
    await this.diaryRepository.update(diaryId, updateDiaryDto);
    return this.diaryRepository.findOneBy({ diaryId });
  }

  async delete(diaryId: number) {
    await this.diaryRepository.delete({ diaryId });
    return diaryId;
  }
}

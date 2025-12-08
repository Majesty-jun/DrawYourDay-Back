import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Diary } from './entities/diary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}

  create(createDiaryDto: CreateDiaryDto) {
    return this.diaryRepository.save(createDiaryDto);
  }

  findAll() {
    return this.diaryRepository.find();
  }

  findOne(diaryId: number) {
    return this.diaryRepository.findOneBy({ diaryId });
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

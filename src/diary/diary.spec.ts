import { Test, TestingModule } from '@nestjs/testing';
import { Diary } from './diary';

describe('Diary', () => {
  let provider: Diary;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Diary],
    }).compile();

    provider = module.get<Diary>(Diary);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

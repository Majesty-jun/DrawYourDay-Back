import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { GoogleGenAI } from '@google/genai';
import { Image } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from 'src/diary/entities/diary.entity';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class ImageService {
  private ai: GoogleGenAI;
  private s3Client: S3Client;
  private bucketName = process.env.AWS_BUCKET_NAME;

  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {
    this.ai = new GoogleGenAI({});

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
  }

  async generateImage(promptText: string): Promise<string> {
    try {
      const response = await this.ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: promptText,
      });

      const generatedImage = response.generatedImages?.[0];

      if (!generatedImage?.image?.imageBytes) {
        throw new Error('이미지 데이터가 없습니다.');
      }

      const buffer = Buffer.from(generatedImage.image.imageBytes, 'base64');
      const fileName = `${uuidv4()}.png`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: buffer,
          ContentType: 'image/png',
        }),
      );

      const s3Url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      console.log(`[S3 Upload] Success: ${s3Url}`);

      return s3Url;
    } catch (error) {
      console.error('[Image Generation Error]', error);
      throw new InternalServerErrorException('이미지 생성 실패');
    }
  }

  async regenerateImage(diaryId: number): Promise<Image> {
    const diary = await this.diaryRepository.findOne({ where: { diaryId } });
    if (!diary) {
      throw new NotFoundException(`ID가 ${diaryId}인 일기를 찾을 수 없습니다.`);
    }

    const imageUrl = await this.generateImage(diary.diaryDesc);

    const newImage = this.imageRepository.create({
      diary: diary,
      imageUrl: imageUrl,
      promptText: diary.diaryDesc,
    });

    return await this.imageRepository.save(newImage);
  }

  async findOne(imageId: number): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { imageId } });
    if (!image) {
      throw new NotFoundException(
        `ID가 ${imageId}인 이미지를 찾을 수 없습니다.`,
      );
    }
    return image;
  }
}

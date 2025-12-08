import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class Image {
  @PrimaryGeneratedColumn()
  imageId: number;

  @Column()
  diaryId: number;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}

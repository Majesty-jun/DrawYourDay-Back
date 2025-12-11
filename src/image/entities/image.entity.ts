import { Diary } from 'src/diary/entities/diary.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  imageId: number;

  @Column({ name: 'diaryId' })
  diaryId: number;

  @Column()
  imageUrl: string;

  @Column()
  promptText: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Diary, (diary) => diary.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'diaryId' })
  diary: Diary;
}

import { Image } from 'src/image/entities/image.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  diaryId: number;

  @Column()
  userId: string;

  @Column()
  weatherId: number;

  @Column()
  diaryDate: Date;

  @Column('text', { array: true })
  diaryFeelings: string[];

  @Column()
  diaryDesc: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @OneToMany(() => Image, (image) => image.diary, { cascade: true })
  images: Image[];
}

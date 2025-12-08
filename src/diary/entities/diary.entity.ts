import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  diaryId: number;

  @Column()
  userId: number;

  @Column()
  weatherId: number;

  @Column()
  diaryDate: string;

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
}

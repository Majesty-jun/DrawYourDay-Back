import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  weatherId: number;

  @Column()
  weatherName: string;

  @Column()
  weatherColor: string;

  @Column()
  isUsed: boolean;

  @Column()
  promptEmotion: string;

  @Column()
  promptColor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;
}

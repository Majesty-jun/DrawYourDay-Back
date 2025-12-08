import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { DiaryModule } from './diary/diary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WeatherModule } from './weather/weather.module';
import { ImageModule } from './image/image.module';
import { User } from './user/entities/user.entity';
import { Diary } from './diary/entities/diary.entity';
import { Image } from './image/entities/image.entity';
import { Weather } from './weather/entities/weather.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot(),
    DiaryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      synchronize: true, // TypeORM 사용시, 자동으로 DB를 업데이트 시킬 지 결정 Production에서는 삭제 필수
      entities: [Diary, User, Weather, Image],
    }),
    AuthModule,
    UserModule,
    WeatherModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

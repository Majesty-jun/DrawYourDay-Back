import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 실제 정의한 값만 들어올 수 있도록 지정
      forbidNonWhitelisted: true, // whitelist에 걸린 항목 존재 시, throw error
      transformOptions: {
        enableImplicitConversion: true, // typescript type 기반으로 자동으로 type 변경
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();

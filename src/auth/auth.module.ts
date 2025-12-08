import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategty';
// import { GoogleStrategy } from './strategy/google.strategy';
// import { KakaoStrategy } from './strategy/kakao.strategy';
// import { NaverStrategy } from './strategy/naver.strategy';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>(
            'JWT_EXPIRES_IN',
            Number(process.env.JWT_EXPIRES_IN),
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    // GoogleStrategy,
    // KakaoStrategy,
    // NaverStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

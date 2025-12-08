// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-naver-v2';
// import { AuthService } from '../auth.service';
// import { AuthProvider } from 'src/common/auth-provider.enum';

// @Injectable()
// export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
//   constructor(
//     private configService: ConfigService,
//     private authService: AuthService,
//   ) {
//     super({
//       cliendID: configService.get<string>('NAVER_CLIENT_ID'),
//       clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
//       callbackURL: configService.get<string>('NAVER_CALLBACK_URL'),
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: any,
//   ): Promise<any> {
//     const { id, email, name } = profile;

//     try {
//       const result = await this.authService.validateOAuthLogin(
//         email,
//         id,
//         AuthProvider.NAVER,
//         name,
//       );
//       done(null, result);
//     } catch (error) {
//       done(error, false);
//     }
//   }
// }

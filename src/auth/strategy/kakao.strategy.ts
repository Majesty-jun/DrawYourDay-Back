// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-kakao';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { AuthService } from '../auth.service';
// import { AuthProvider } from 'src/common/auth-provider.enum';

// @Injectable()
// export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
//   constructor(
//     private configService: ConfigService,
//     private authService: AuthService,
//   ) {
//     super({
//       clientID: configService.get<string>('KAKAO_CLIENT_ID'),
//       callbackURL: configService.get<string>('KAKAO_CALLBACK_URL'),
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: any,
//   ): Promise<any> {
//     const { id, _json } = profile;
//     const email = _json.kakao_account.email;
//     const name = _json.properties.nickname;

//     try {
//       const result = await this.authService.validateOAuthLogin(
//         email,
//         id,
//         AuthProvider.KAKAO,
//         name,
//       );
//       done(null, result);
//     } catch (error) {
//       done(error, false);
//     }
//   }
// }

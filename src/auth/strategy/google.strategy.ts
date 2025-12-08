// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { AuthService } from '../auth.service';
// import { AuthProvider } from 'src/common/auth-provider.enum';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(
//     private configService: ConfigService,
//     private authService: AuthService,
//   ) {
//     super({
//       clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
//       clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
//       callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     const { id, emails, displayName } = profile;
//     const email = emails[0].value;

//     try {
//       const result = await this.authService.validateOAuthLogin(
//         email,
//         id,
//         AuthProvider.GOOGLE,
//         displayName,
//       );
//       done(null, result);
//     } catch (error) {
//       done(error, false);
//     }
//   }
// }

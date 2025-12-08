import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  // Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { SignupDto } from './dto/signup.dto';
import { AuthResponse } from 'src/common/interface';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
// import { GoogleAuthGuard } from './guard/google-auth.guard';
// import { KakaoAuthGuard } from './guard/kakao-auth.guard';
// import { NaverAuthGuard } from './guard/naver-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 로컬 회원가입
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponse> {
    return this.authService.signup(signupDto);
  }

  // 로컬 로그인
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req,
    @Body() loginDto: LoginDto,
  ): Promise<AuthResponse> {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  // //Google 로그인
  // @Get('google/callback')
  // @UseGuards(GoogleAuthGuard)
  // async googleAuthCallback(@Request() req, @Res() res: Response) {
  //   const authResponse: AuthResponse = req.user;

  //   return res.redirect(
  //     `${process.env.FRONTEND_URL}/auth/callback?token=${authResponse.accessToken}`,
  //   );
  // }

  // //Kakao 로그인
  // @Get('kakao')
  // @UseGuards(KakaoAuthGuard)
  // async kakaoAuth() {
  //   // Guard가 리다이렉트를 처리하므로 빈 응답을 반환합니다.
  // }

  // //Kakao 로그인 콜백
  // @Get('kakao/callback')
  // @UseGuards(KakaoAuthGuard)
  // async kakaoAuthCallback(@Request() req, @Res() res: Response) {
  //   const authResponse: AuthResponse = req.user;

  //   return res.redirect(
  //     `${process.env.FRONTEND_URL}/auth/callback?token=${authResponse.accessToken}`,
  //   );
  // }

  // //Naver 로그인
  // @Get('naver')
  // @UseGuards(NaverAuthGuard)
  // async naverAuth() {
  //   // Guard가 리다이렉트를 처리하므로 빈 응답을 반환합니다.
  // }

  // //Naver 로그인 콜백
  // @Get('naver/callback')
  // @UseGuards(NaverAuthGuard)
  // async naverAuthCallback(@Request() req, @Res() res: Response) {
  //   const authResponse: AuthResponse = req.user;

  //   return res.redirect(
  //     `${process.env.FRONTEND_URL}/auth/callback?token=${authResponse.accessToken}`,
  //   );
  // }
}

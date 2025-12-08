import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { AuthResponse } from 'src/common/interface';
import { UserService } from 'src/user/user.service';
import { AuthProvider } from 'src/common/auth-provider.enum';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(User)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateAuthResponse(user: User): AuthResponse {
    const payload = {
      sub: user.id,
      email: user.email,
      provider: user.provider,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        provider: user.provider,
      },
    };
  }

  async signup(signupDto: SignupDto): Promise<AuthResponse> {
    const user = await this.userService.createLocalUser(signupDto);
    return this.generateAuthResponse(user);
  }

  async validateLocalUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.provider !== AuthProvider.LOCAL || !user.password) {
      throw new UnauthorizedException(
        `This Account use ${user.provider} to login`,
      );
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return user;
  }

  login(user: User): AuthResponse {
    return this.generateAuthResponse(user);
  }

  async validateOAuthLogin(
    email: string,
    providerId: string,
    provider: AuthProvider,
    username: string,
  ): Promise<AuthResponse> {
    const user = await this.userService.createOrUpdateSocialUser(
      email,
      providerId,
      provider,
      username,
    );
    return this.generateAuthResponse(user);
  }

  async validateUserById(userId: string): Promise<User> {
    return await this.userService.findById(userId);
  }
}

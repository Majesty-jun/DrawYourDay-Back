import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interface';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey',
    });
  }

  // async validate(payload: JwtPayload): Promise<User> {
  //   return this.authService.validateUserById(payload.sub);
  // }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub: id } = payload;
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('접근 권한이 없습니다.');
    }

    return user;
  }
}

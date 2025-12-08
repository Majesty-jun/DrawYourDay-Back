import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthProvider } from 'src/common/auth-provider.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 로컬 회원가입용 사용자 생성
  async createLocalUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username } = createUserDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    if (!password) {
      throw new BadRequestException('Password is required for local users');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
      provider: AuthProvider.LOCAL,
    });

    return this.userRepository.save(newUser);
  }

  // 소셜 로그인용 사용자 생성 또는 업데이트
  async createOrUpdateSocialUser(
    email: string,
    providerId: string,
    provider: AuthProvider,
    username: string,
  ): Promise<User> {
    let user = await this.findbyProviderId(providerId, provider);

    if (user) {
      user.username = username;
      return this.userRepository.save(user);
    }

    user = await this.findByEmail(email);
    if (user && user.provider === provider) {
      throw new ConflictException(
        `User with this email already exists for the ${user.provider} provider`,
      );
    }

    const newUser = this.userRepository.create({
      email,
      providerId,
      provider,
      username,
    });

    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findbyProviderId(
    providerId: string,
    provider: AuthProvider,
  ): Promise<User | null> {
    return this.userRepository.findOneBy({ providerId, provider });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

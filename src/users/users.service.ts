import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async transformPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, confirmPassword, nickname, introduction } =
      createUserDto;
    const exUser = await this.findByEmail(email);
    if (exUser)
      throw new UnauthorizedException({
        message: '이미 존재하는 이메일입니다.',
      });

    if (password !== confirmPassword)
      throw new UnauthorizedException({ message: '비밀번호를 확인해주세요.' });

    const hashedPassword = await this.transformPassword(password);

    await this.userRepository.insert({
      email,
      password: hashedPassword,
      nickname,
      introduction,
    });

    return { message: '회원가입에 성공하였습니다' };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

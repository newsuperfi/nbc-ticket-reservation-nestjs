import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
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

  // 인증 미들웨어용 조회 메서드, 현재 미사용
  async authFind(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // 이메일 체크
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // Id로 회원 조회
  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // 비밀번호 암호화
  async transformPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  // 회원가입
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, confirmPassword, nickname, introduction } =
      createUserDto;
    if (!email || !password || !confirmPassword || !nickname)
      throw new BadRequestException('필수 입력사항을 모두 입력해주세요');
    const exUser = await this.findByEmail(email);
    if (exUser) throw new UnauthorizedException('이미 존재하는 이메일입니다.');

    if (password !== confirmPassword)
      throw new UnauthorizedException('비밀번호를 확인해주세요.');

    const hashedPassword = await this.transformPassword(password);

    await this.userRepository.insert({
      email,
      password: hashedPassword,
      nickname,
      introduction,
    });

    return { message: '회원가입에 성공하였습니다' };
  }

  // 예매 시 포인트 변동 - 트랜잭션 시 작동되지 않는 문제로 주석처리
  // async updatePoint(user) {
  //   console.log('업데이트포인트ㅡㅡ', user);
  //   await this.userRepository.save(user);
  //   return;
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

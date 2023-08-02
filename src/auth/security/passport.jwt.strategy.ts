import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Payload } from './payload.interface';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

// Header대신 cookie에 토큰 심었을때는 이 함수를 활용. jwrFromRequest뒤에 이어주기.
// let cookieExtractor = function( req )
// {
// 	var token = null;
// 	if ( req && req.cookies )
// 	{
// 		token = req.cookies["Authentication"] || req.header;
// 	}
// 	return token;
// };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // 헤더에서 BearerToken을 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'SECRET_KEY',
    });
  }

  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const user = await this.authService.tokenValidateUser(payload);
    if (!user) {
      return done(
        new UnauthorizedException({ message: '존재하지 않는 회원입니다.' }),
        false,
      );
    }
    return done(null, user);
  }
}

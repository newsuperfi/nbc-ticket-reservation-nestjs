import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  canActivate(context: ExecutionContext): any {
    // const request = context.switchToHttp().getRequest();
    // const authorization = request.headers.authorization;
    // console.log(authorization);

    return super.canActivate(context);
  }
}

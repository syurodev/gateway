import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  BaseResponse,
  LoginResponse,
} from 'src/v1/grpc/protos/interfaces/oauth';
import { OauthService } from 'src/v1/oauth/oauth.service';

/**
 * ! Không sử dụng chung với @Body
 *
 * examples: bash-controller.controller.ts
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly oauthService: OauthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const call = context.switchToRpc().getContext() as any;
    // const metadata: Metadata = call.metadata || call.internalRepr;
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new HttpException('Token không hợp lệ!', HttpStatus.UNAUTHORIZED);
    }

    //Xác thực token
    const user: LoginResponse = await this.oauthService.validateToken({
      token: authorization,
    });

    if (user.status !== HttpStatus.OK) {
      throw new HttpException(
        user?.message || 'Token không hợp lệ!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // request.user = Buffer.from(JSON.stringify(user.data)).toString('base64');
    request.user = user.data;

    return true;
  }
}

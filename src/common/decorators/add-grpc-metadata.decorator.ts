import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { LoginResponseData } from 'src/v1/grpc/protos/interfaces/oauth';

export const AddGrpcMetadata = createParamDecorator(
  (privileges: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const metadata: Metadata = new Metadata();
    const user: LoginResponseData = request.user;

    if (!user) {
      throw new HttpException('Token không hợp lệ!', HttpStatus.UNAUTHORIZED);
    }
    // const userData: LoginResponseData = JSON.parse(
    //   Buffer.from(user, 'base64').toString('utf8'),
    // );

    if (privileges && privileges.length > 0) {
      if (
        !user.privileges.every((privilege) => privileges.includes(privilege))
      ) {
        throw new HttpException(
          'Bạn không có quyền thực hiện chức năng này',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    metadata.add('user', JSON.stringify(user));

    return metadata;
  },
);

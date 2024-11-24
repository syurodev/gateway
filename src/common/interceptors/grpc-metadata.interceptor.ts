import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class GrpcMetadataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    try {
      const metadata: Metadata = new Metadata();
      const token = request.headers.authorization;

      metadata.add('authorization', token || '');
      context.switchToRpc().getContext().metadata = metadata;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return next.handle().pipe(
      tap(() => {
        // Do something with the response if needed
      }),
    );
  }
}

import {
  Controller,
  Get,
  HttpStatus,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { GrpcMetadataInterceptor } from 'src/common/interceptors/grpc-metadata.interceptor';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AddGrpcMetadata } from 'src/common/decorators/add-grpc-metadata.decorator';
import { Metadata } from '@grpc/grpc-js';

@Controller('users')
@UseInterceptors(GrpcMetadataInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async getUser(
    // @AddGrpcMetadata() metadata: Metadata,
    @Res() res: Response,
  ) {
    // return res
    //   .status(HttpStatus.OK)
    //   .send(await this.freightsService.create(body, metadata));
    // console.log(metadata);
    return res.status(HttpStatus.OK).send();
  }
}

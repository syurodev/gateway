import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { GrpcUtil } from '@syurodev/ts-common';

import {
  BaseResponse,
  LoginDTO,
  LoginResponse,
  OAUTH_SERVICE_NAME,
  OauthServiceClient,
  RegisterDTO,
  ValidateTokenDTO,
} from '../grpc/protos/interfaces/oauth';
import { GRPC_NAME } from 'src/common/constants/grpc-name.enum';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OauthService {
  private oauthServiceClient: OauthServiceClient;

  constructor(
    @Inject(GRPC_NAME.GRPC_NODEJS_USER)
    private readonly clientGrpc: ClientGrpc,
  ) {
    this.oauthServiceClient =
      this.clientGrpc.getService<OauthServiceClient>(OAUTH_SERVICE_NAME);
  }

  async register(
    registerDTO: RegisterDTO,
    metadata?: Metadata,
  ): Promise<BaseResponse> {
    try {
      return await GrpcUtil.reTry<BaseResponse>(
        this.oauthServiceClient.register(registerDTO, metadata),
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(loginDTO: LoginDTO, metadata?: Metadata): Promise<LoginResponse> {
    try {
      return await GrpcUtil.reTry<LoginResponse>(
        this.oauthServiceClient.login(loginDTO, metadata),
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateToken(
    validateTokenDTO: ValidateTokenDTO,
    metadata?: Metadata,
  ): Promise<LoginResponse> {
    try {
      console.log(123);
      return await GrpcUtil.reTry<LoginResponse>(
        this.oauthServiceClient.validateToken(
          validateTokenDTO,
          metadata ?? new Metadata(),
        ),
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

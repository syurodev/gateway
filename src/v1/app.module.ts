import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { GrpcModule } from './grpc/grpc.module';
import { VERSION_CONTROLLER_ENUM } from 'src/common/constants/version-controller.enum';
import { OauthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';

let routes: Routes = [
  {
    path: VERSION_CONTROLLER_ENUM.V1,
    children: [OauthModule, UserModule],
  },
];

@Module({
  imports: [RouterModule.register(routes), GrpcModule, OauthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppV1Module {}

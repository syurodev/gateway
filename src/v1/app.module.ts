import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { GrpcModule } from './grpc/grpc.module';
import { VERSION_CONTROLLER_ENUM } from 'src/common/constants/version-controller.enum';

let routes: Routes = [
  {
    path: VERSION_CONTROLLER_ENUM.V1,
    children: [
      // UserModule,
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes), GrpcModule],
  controllers: [],
  providers: [],
})
export class AppV1Module {}

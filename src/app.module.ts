import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppV1Module } from './v1/app.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AppV1Module,
  ],
})
export class AppModule {}

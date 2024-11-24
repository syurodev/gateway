import { Global, Module } from '@nestjs/common';
import { OauthService } from './oauth.service';

@Global()
@Module({
  providers: [OauthService],
  exports: [OauthService],
})
export class OauthModule {}

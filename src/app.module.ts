import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProxyMiddleware } from './common/middleware/proxy.middleware';

@Module({
  imports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProxyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

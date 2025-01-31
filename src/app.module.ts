import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProxyMiddleware } from './common/middleware/proxy.middleware';
import { DecryptMiddleware } from './common/middleware/decrypt.middleware';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecryptMiddleware)
      .exclude({ path: 'health-check', method: RequestMethod.ALL }) // Loại trừ tất cả method của /health-check
      .forRoutes({ path: '*', method: RequestMethod.POST })
      .apply(ProxyMiddleware)
      .exclude({ path: 'health-check', method: RequestMethod.ALL }) // Loại trừ tất cả method của /health-check
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

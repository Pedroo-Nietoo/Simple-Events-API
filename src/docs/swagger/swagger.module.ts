import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { setupSwagger } from '../../config/swagger.config';

@Module({})
export class SwaggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer & { getHttpAdapter: () => any }) {
    setupSwagger(consumer.getHttpAdapter().getInstance());
  }
}

import { setupSwagger } from '@/config/swagger.config';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({})
export class SwaggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer & { getHttpAdapter: () => any }) {
    setupSwagger(consumer.getHttpAdapter().getInstance());
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Simple Events API')
    .setDescription(
      'API para aplicação de gestão de participantes em eventos presenciais.',
    )
    .setVersion('BETA')
    .setContact(
      'Pedro Henrique Nieto da Silva',
      'https://github.com/Pedroo-Nietoo',
      'pedronieto.2005@gmail.com',
    )
    .addServer('http://localhost:3000', 'Dev server')
    .addServer('http://api.simple-events.com', 'Prod server')

    .addTag('Users', 'All about users', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })
    .addTag('Events', 'All about events', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })
    .addTag('Health', 'All about service health check', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();

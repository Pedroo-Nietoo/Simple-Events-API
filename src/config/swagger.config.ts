import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Simple Events API')
    .setDescription(
      'API para aplicação de gestão de participantes em eventos presenciais.',
    )
    .setVersion('BETA')
    .setContact(
      '@Pedroo-Nietoo',
      'https://github.com/Pedroo-Nietoo',
      'pedronieto.2005@gmail.com',
    )
    .addBearerAuth()

    .addServer('http://localhost:3000', 'Dev server')
    .addServer('https://simple-events.api.com', 'Prod server')

    .addTag('Users', 'All about users', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })
    .addTag('Events', 'All about events', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })
    .addTag('Auth', 'All about authentication and authorization', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })
    .addTag('Health', 'All about service health check', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Simple Event - Documentation',
    customCssUrl: 'swagger.styles.css',
    customJs: 'swagger.script.js',
    // customfavIcon: 'logo.ico',
  });
}

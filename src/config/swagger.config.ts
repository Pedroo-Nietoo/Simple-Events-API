import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up Swagger documentation for the provided NestJS application.
 * @param app - The NestJS application instance to set up Swagger for.
 */
export function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Simple Events API')
    .setDescription('API for managing participants in in-person events.')
    .setVersion('BETA')
    .setContact(
      '@Pedroo-Nietoo',
      'https://github.com/Pedroo-Nietoo',
      'pedronieto.2005@gmail.com',
    )
    .addBearerAuth()

    .addServer('http://localhost:3000', 'Dev server')
    .addServer('https://simple-events.api.com', 'Prod server')

    .addTag('Users', 'All about the users module', {
      description: 'More info',
      url: 'https://simple-events-docs.apidocumentation.com/reference#tag/users',
    })
    .addTag('Events', 'All about the events module', {
      description: 'More info',
      url: 'https://simple-events-docs.apidocumentation.com/reference#tag/events',
    })
    .addTag('Auth', 'All about the authentication/authorization module', {
      description: 'More info',
      url: 'https://simple-events-docs.apidocumentation.com/reference#tag/auth',
    })
    .addTag('Health', 'All about the health module', {
      description: 'More info',
      url: 'https://simple-events-docs.apidocumentation.com/reference#tag/health',
    })
    .addTag('General', 'The base API endpoint', {
      description: 'More info',
      url: 'https://simple-events-docs.apidocumentation.com/reference#tag/general',
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

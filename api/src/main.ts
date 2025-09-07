import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap(): Promise<void> {

  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 8080;
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const config = new DocumentBuilder().
    setTitle('API Restful NestJS')
    .setDescription('API Restful com NestJS do zero ao deploy com docker, terraform e aws')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const swaggerCDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.7.2';
   const document = SwaggerModule.createDocument(app, config);

   SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'API Restful NestJS',
    customJs: [
      `${swaggerCDN}/swagger-ui-bundle.js`,
      `${swaggerCDN}/swagger-ui-standalone-preset.js`,
    ]
   });

  await app.listen(PORT, "0.0.0.0");

  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger is running on port ${PORT}/api`);
}
bootstrap();

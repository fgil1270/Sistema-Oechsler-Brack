import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLoggerService } from './logger/logger.service';
import * as expressListRoutes from 'express-list-endpoints';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService(),
  });
  app.enableCors( {
    origin: '*',
    /*methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    optionsSuccessStatus: 200*/
  }  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  process.env.TZ = 'Etc/Universal'; //establece la zona horaria universal
  // Configuración Swagger en NestJS
  const config = new DocumentBuilder()
    .setTitle('API OECHSLER')
    .setDescription('Documentación OECHSLER API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // URL API
  SwaggerModule.setup('docs', app, document);
  

  await app.listen(process.env.PORT);

  const server = app.getHttpServer();
  const router = server._events.request._router;
  //console.log(expressListRoutes({}, 'API:', router));
}
bootstrap();

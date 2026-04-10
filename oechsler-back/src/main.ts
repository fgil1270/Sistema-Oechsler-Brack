import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLoggerService } from './logger/logger.service';
import * as expressListRoutes from 'express-list-endpoints';
import * as bodyParser from 'body-parser';

function isAddressInUseError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'EADDRINUSE'
  );
}

async function bootstrap() {

  // Aumentar el límite de listeners para evitar la advertencia de memory leak
  process.setMaxListeners(20);

  const logger = new CustomLoggerService();
  const customLogger = new CustomLoggerService();

  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService(),
  });

  const allowedOrigins = [
    'http://192.168.51.39:4200',
    'http://localhost:4200',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS bloqueado para origen: ${origin}`));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 204,
  });
  try {
    /// Límite para datos codificados en URL
    //Aumentar el límite de tamaño del cuerpo de la solicitud
    app.use(bodyParser.json({ limit: '50mb' })); // Límite para JSON
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  } catch (error) {
    logger.error('Error al configurar body parser', error);
    throw error;
  }


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

  // ✅ Manejar promesas rechazadas no capturadas
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('❌ Unhandled Rejection at:', promise.toString());
    logger.error('Reason:', reason);
    customLogger.error('Unhandled Rejection', JSON.stringify({
      reason: reason?.message || reason,
      stack: reason?.stack,
      promise: promise.toString(),
    }));

    /* if (isAddressInUseError(reason)) {
      logger.error('Puerto en uso. Cerrando proceso para evitar watcher colgado.', reason);
      process.exit(1);
    } */
  });

  // ✅ Manejar excepciones no capturadas
  process.on('uncaughtException', (error: Error) => {
    logger.error('❌ Uncaught Exception:', error.message);
    logger.error('Stack:', error.stack);
    customLogger.error('Uncaught Exception', JSON.stringify({
      message: error.message,
      stack: error.stack,
      name: error.name,
    }));

    /* if (isAddressInUseError(error)) {
      logger.error('Puerto en uso por excepción no capturada. Cerrando proceso.', error.message);
      process.exit(1);
    } */
  });

  // ✅ Manejar advertencias
  process.on('warning', (warning: Error) => {
    logger.warn(`⚠️ Warning: ${warning.name}`);
    logger.warn(`Message: ${warning.message}`);
    customLogger.warn(`Process Warning: ${JSON.stringify({
      name: warning.name,
      message: warning.message,
      stack: warning.stack,
    })}`);
  });

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.warn(`Recibida señal ${signal}. Cerrando aplicación...`);
    await app.close();
    process.exit(0);
  };

  process.once('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  try {
    await app.listen(process.env.PORT);
  } catch (error) {
    if (isAddressInUseError(error)) {
      logger.error('El puerto configurado ya está en uso. Finalizando proceso actual.', error);
      process.exit(1);
    }
    throw error;
  }

  const server = app.getHttpServer();
  const router = server._events.request._router;
  console.log('Application is running on: ', await app.getUrl());
  //console.log(expressListRoutes({}, 'API:', router));
}
bootstrap();

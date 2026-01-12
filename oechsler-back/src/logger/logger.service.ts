import { LoggerService, Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info', // Cambiar de 'debug' a 'info' para reducir logs
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console({
          handleExceptions: true,
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          handleExceptions: true,
        }),
      ],
      exitOnError: false,
    });
  }

  log(message: string) {
    // Filtrar mensajes de inicialización de módulos de NestJS
    if (message.includes('dependencies initialized') ||
      message.includes('Starting Nest application') ||
      message.includes('Mapped {') ||
      (message.includes('{') && message.includes('route'))) {
      return;
    }
    // Usar setImmediate para no bloquear el event loop
    setImmediate(() => {
      this.logger.info(message);
    });
  }

  error(message: string, trace: string) {
    setImmediate(() => {
      this.logger.error(`${message} - ${trace}`);
    });
  }

  warn(message: string) {
    setImmediate(() => {
      this.logger.warn(message);
    });
  }

  debug(message: string) {
    // Solo loguear debug si realmente es necesario
    setImmediate(() => {
      this.logger.debug(message);
    });
  }

  verbose(message: string) {
    // Verbose puede generar muchos logs, usar con precaución
    setImmediate(() => {
      this.logger.verbose(message);
    });
  }
}
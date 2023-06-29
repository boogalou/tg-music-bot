import winston, { Logger } from 'winston';

export class LoggerService {
  logger: Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
      }));
    }
  }

  public info(message: any, ...meta: unknown[]) {
    this.logger.info(message, ...meta);
  };

  public warn(message: any, ...meta: unknown[]) {
    this.logger.warn(message, ...meta);
  };

  public error(message: any, ...meta: unknown[]) {
    this.logger.error(message, ...meta);
  };
}

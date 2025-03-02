import { injectable } from "inversify";
import winston, { Logger } from 'winston';

import { ILogger } from "../interfaces/ILogger";
import { loggerConfig } from "../configs/loggerConfg";

@injectable()
export class LoggerService implements ILogger {

  private logger: Logger;

  constructor() {
    this.logger = winston.createLogger(loggerConfig);
  }

  public info(message: any, ...meta: unknown[]) {
    this.logger.info(message, ...meta);
  }

  public warn(message: any, ...meta: unknown[]) {
    this.logger.warn(message, ...meta);
  }

  public error(message: any, ...meta: unknown[]) {
    this.logger.error(message, ...meta);
  }
}
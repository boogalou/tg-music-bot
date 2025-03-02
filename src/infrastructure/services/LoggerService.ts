import { injectable } from "inversify";
import winston, { Logger } from 'winston';
import chalk from "chalk";

import { ILogger } from "../interfaces/ILogger";

@injectable()
export class LoggerService implements ILogger {

  private logger: Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: "HH:MM:ss DD.MM.YYYY"
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.simple(),
            winston.format.printf(({ level, message, timestamp }) => {

              let coloredLevel = level;
              let coloredMessage = message;
              let coloredTimestamp = timestamp;

              switch (level) {
                case "info":
                  coloredLevel = `${ chalk.bold.bgHex("#91C483").hex("#525E75")(` ${ level } `) }`;
                  coloredMessage = chalk.hex("#A1B57D")(`${ message }`);
                  coloredTimestamp = chalk.hex("#A1B57D")(timestamp);
                  break;

                case "warn":
                  coloredLevel = chalk.bold.bgHex("#E9B824").hex("#3D3B40")(` ${ level } `);
                  coloredMessage = chalk.hex("#FFC85C")(message);
                  coloredTimestamp = chalk.hex("#FFC85C")(timestamp);
                  break;

                case "error":
                  coloredLevel = chalk.bold.bgHex("#EF6262").hex("#2D2727")(` ${ level } `);
                  coloredMessage = chalk.hex("#E96479")(message);
                  coloredTimestamp = chalk.hex("#E96479")(timestamp);
                  break;

                default:
                  break
              }

              return `${ coloredLevel } : ${ coloredMessage }, ${ coloredTimestamp }`
            }),
          )
        }),
      ],
    });
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
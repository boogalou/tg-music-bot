export interface ILogger {

  logger: unknown;

  info: (message: any, ...meta: unknown[]) => void;

  warn: (message: any, ...meta: unknown[]) => void;

  error: (message: any, ...meta: unknown[]) => void;

}
import { Logger } from "winston";

export interface ILogger {

  info: (message: any, ...meta: unknown[]) => void;

  warn: (message: any, ...meta: unknown[]) => void;

  error: (message: any, ...meta: unknown[]) => void;

}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const winston_1 = __importDefault(require("winston"));
class LoggerService {
    constructor() {
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
                new winston_1.default.transports.File({ filename: 'combined.log' }),
            ],
        });
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
            }));
        }
    }
    info(message, ...meta) {
        this.logger.info(message, ...meta);
    }
    ;
    warn(message, ...meta) {
        this.logger.warn(message, ...meta);
    }
    ;
    error(message, ...meta) {
        this.logger.error(message, ...meta);
    }
    ;
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map
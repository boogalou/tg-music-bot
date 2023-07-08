"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const dotenv_1 = require("dotenv");
class ConfigService {
    constructor() {
        const { error, parsed } = (0, dotenv_1.config)();
        if (error || !parsed) {
            throw new Error('env file not found or empty');
        }
        this.config = parsed;
    }
    get(key) {
        const result = this.config[key];
        if (!result) {
            throw new Error('token invalid');
        }
        return result;
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map
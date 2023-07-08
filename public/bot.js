"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const telegraf_1 = require("telegraf");
const start_command_1 = require("./commands/start.command");
const search_command_1 = require("./commands/search.command");
class Bot {
    constructor(logger) {
        this.logger = logger;
        this.commands = [];
        this.apiKey = process.env.NODE_ENV === 'production' ? process.env.BOT_TOKEN_PROD : process.env.BOT_TOKEN_DEV;
        if (this.apiKey) {
            this.bot = new telegraf_1.Telegraf(this.apiKey);
        }
        console.log(this.bot.use());
        this.bot.use((0, telegraf_1.session)());
    }
    ;
    init() {
        this.commands = [
            new start_command_1.StartCommand(this.bot, this.logger),
            new search_command_1.SearchCommand(this.bot, this.logger),
        ];
        for (const command of this.commands) {
            command.handle();
        }
        this.bot.launch();
        this.logger.info(`bot was launched successfully in ${process.env.NODE_ENV === 'production'
            ? 'production'
            : 'development'} mode`);
    }
}
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map
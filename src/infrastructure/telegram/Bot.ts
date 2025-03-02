import { session, Telegraf } from "telegraf";
import { inject, injectable } from "inversify";
import 'reflect-metadata';

import { TYPES } from "../../di/types";
import { ILogger } from "../interfaces/ILogger";
import { IEnvConfigService } from "../interfaces/IEnvConfigService";
import { IBotContext } from "../interfaces/IBotContext";
import { IBotService } from "../interfaces/IBotService";
import { IBot } from "../interfaces/IBot";

@injectable()
export class Bot implements IBot {
  bot: Telegraf<IBotContext>;

  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger,
    @inject(TYPES.IConfigService) private readonly configService: IEnvConfigService,
    @inject(TYPES.IBotService) private readonly botService: IBotService,
  ) {
    const botToken = process.env.NODE_ENV === 'production'
      ? this.configService.get('BOT_TOKEN_PROD')
      : this.configService.get('BOT_TOKEN_DEV');

    if (!botToken) {
      const errorMessage = 'Bot token not found in configuration.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.bot = new Telegraf<IBotContext>(botToken);
    this.bot.use(session());
  }

  public async init() {
    this.botService.registerCommands(this.bot);
    this.logger.info("✅Bot initialized and commands registered");
    this.bot.launch();
    this.logger.info("🚀 Bot started!");
  }
}

import { Scenes, session, Telegraf } from "telegraf";
import { inject, injectable } from "inversify";
import 'reflect-metadata';

import { TYPES } from "../../../di/types";
import { ILogger } from "../config/logger/ILogger";
import { IEnvConfigService } from "../config/env/IEnvConfigService";
import { BotService } from "../../../application/services/BotService";

@injectable()
export class Bot {
  bot: Telegraf<Scenes.SceneContext>;

  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger,
    @inject(TYPES.IConfigService) private readonly configService: IEnvConfigService,
    @inject(TYPES.BotService) private readonly botService: BotService
  ) {
    const botToken = process.env.NODE_ENV === 'production'
      ? this.configService.get('BOT_TOKEN_PROD')
      : this.configService.get('BOT_TOKEN_DEV');

    if (!botToken) {
      const errorMessage = 'Bot token not found in configuration.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.bot = new Telegraf<Scenes.SceneContext>(botToken);
    this.bot.use(session());

  }

  public async init() {
    this.botService.registerCommands(this.bot);
    this.logger.info("✅Bot initialized and commands registered");
    this.bot.launch();
    this.logger.info("🚀 Bot started!");
  }
}

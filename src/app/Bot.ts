import { inject, injectable } from "inversify";
import 'reflect-metadata';
import { Scenes, session, Telegraf } from "telegraf";
import { ILogger } from "./config/logger/ILogger";
import { IEnvConfigService } from "./config/env/IEnvConfigService";
import { TYPES } from "./di/types";
import { SearchCommand } from "./presentation/searchCommand/SearchCommand";
import { StartCommand } from "./presentation/startCommand/StartCommand";
import { ISearchViewModel } from "./presentation/searchCommand/ISearchViewModel";
import { Command } from "./Command";

@injectable()
export class Bot {
  bot: Telegraf<Scenes.SceneContext>;
  commands: Command[] = [];
  apiKey: string | undefined;

  constructor(
   @inject(TYPES.ILogger) private readonly logger: ILogger,
   @inject(TYPES.IConfigService) private readonly configService: IEnvConfigService,
   @inject(TYPES.ISearchViewModel) private searchViewModel: ISearchViewModel,
  ) {
    this.apiKey = process.env.NODE_ENV === 'production'
      ? this.configService.get('BOT_TOKEN_PROD')
      : this.configService.get('BOT_TOKEN_DEV');

    if (this.apiKey) {
      this.bot = new Telegraf<Scenes.SceneContext>(this.apiKey);
    } else {
      const errorMessage: string = 'Bot token not found in configuration.';
      this.logger.error(errorMessage);
      // throw Error(errorMessage);
    }

    if (this.bot) {
      this.bot.use(session());
    }
  };

  public init() {
    this.commands = [
      new StartCommand(this.bot, this.logger),
      new SearchCommand(this.bot, this.logger, this.searchViewModel),
    ];

    this.commands.forEach((cmd) => cmd.handle());


    this.bot.launch()
    this.logger.info(`bot was launched successfully in ${
      process.env.NODE_ENV === 'production'
        ? 'production'
        : 'development' } mode`);
  }
}

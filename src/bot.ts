import {IConfigService} from "./config/config.interface";
import {Scenes, session, Telegraf} from "telegraf";
import {IBotContext} from "./context/context.interface";
import {Command} from "./commands/command.class";
import {StartCommand} from "./commands/start.command";
import {SearchCommand} from "./commands/search.command";
import {LoggerService} from "./services/logger.service";

export class Bot {
  bot: Telegraf<Scenes.SceneContext>;
  commands: Command[] = [];

  constructor(
      private readonly configService: IConfigService,
      private readonly logger: LoggerService,
  ) {
    this.bot = new Telegraf<Scenes.SceneContext>(
        this.configService.get(process.env.NODE_ENV === 'production' ? 'BOT_TOKEN_PROD' : 'BOT_TOKEN_DEV'));
    this.bot.use(session());
  };

  init() {
    this.commands = [new StartCommand(this.bot, this.logger), new SearchCommand(this.bot, this.logger)];

    for (const command of this.commands) {
      command.handle();
    }

    this.bot.launch()
    this.logger.info(`bot was launched successfully in ${
        process.env.NODE_ENV === 'production'
            ? 'production'
            : 'development'} mode`);
  }
}

import {Scenes, session, Telegraf} from "telegraf";
import {Command} from "./commands/command.class";
import {StartCommand} from "./commands/start.command";
import {SearchCommand} from "./commands/search.command";
import {LoggerService} from "./services/logger.service";

export class Bot {
  bot: Telegraf<Scenes.SceneContext>;
  commands: Command[] = [];
  apiKey: string | undefined;

  constructor(
      private readonly logger: LoggerService,
  ) {
    this.apiKey = process.env.NODE_ENV === 'production' ? process.env.BOT_TOKEN_PROD : process.env.BOT_TOKEN_DEV;
    if (this.apiKey) {
      this.bot = new Telegraf<Scenes.SceneContext>(this.apiKey);
    }
    this.bot.use(session());
  };

  init() {
    this.commands = [
      new StartCommand(this.bot, this.logger),
      new SearchCommand(this.bot, this.logger),
    ];

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

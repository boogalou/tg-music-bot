import { Scenes, Telegraf } from "telegraf";
import { inject, injectable } from "inversify";

import { ILogger } from "../../infrastructure/services/config/logger/ILogger";
import { TYPES } from "../../di/types";
import { ICommand } from "../../presentation/interfaces/ICommand";


@injectable()
export class BotService {
  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger,
    @inject(TYPES.ICommand) private readonly commands: ICommand[]
  ) {}

  public registerCommands(bot: Telegraf<Scenes.SceneContext>) {
    this.commands.forEach((cmd) => cmd.handle(bot));
    this.logger.info("🤖Commands registered");
  }
}
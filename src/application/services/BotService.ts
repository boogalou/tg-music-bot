import { Telegraf } from "telegraf";
import { inject, injectable } from "inversify";

import { ILogger } from "../../infrastructure/interfaces/ILogger";
import { TYPES } from "../../di/types";
import { ICommand } from "../../presentation/interfaces/ICommand";
import { IBotContext } from "../../infrastructure/interfaces/IBotContext";
import { IBotService } from "../../infrastructure/interfaces/IBotService";

@injectable()
export class BotService implements IBotService {
  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger,
    @inject(TYPES.ICommand) private readonly commands: ICommand[]
  ) {}

  public registerCommands(bot: Telegraf<IBotContext>) {
    this.commands.forEach((cmd) => cmd.handle(bot));
    this.logger.info("🤖Commands registered");
  }
}
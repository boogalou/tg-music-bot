import { inject, injectable } from "inversify";

import { TYPES } from "../../di/types";
import { ILogger } from "../../infrastructure/interfaces/ILogger";
import { Telegraf } from "telegraf";
import { ICommand } from "../interfaces/ICommand";
import { IBotContext } from "../../infrastructure/interfaces/IBotContext";

@injectable()
export class StartCommand implements ICommand {
  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger,
  ) {}

  public handle(bot: Telegraf<IBotContext>,) {

    bot.command('start', async (ctx) => {
      await ctx.reply('Hello I\'m bot')
    });
  }
}
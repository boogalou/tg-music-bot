import { inject, injectable } from "inversify";
import { SceneContext } from "telegraf/typings/scenes";
import { Telegraf } from "telegraf";

import { ICommand } from "../../domain/commands/ICommand";
import { TYPES } from "../../di/types";
import { ILogger } from "../../infrastructure/services/config/logger/ILogger";

@injectable()
export class StartCommand implements ICommand {
  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger,

  ) {}

  public handle(bot: Telegraf<SceneContext>) {
    bot.command('start', async (ctx) => {
      await ctx.reply('Hello I\'m bot')
    });
  }
}
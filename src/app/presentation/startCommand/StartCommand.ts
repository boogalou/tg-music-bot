import { Telegraf } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";
import { ILogger } from "../../config/logger/ILogger";
import { injectable } from "inversify";
import { Command } from "../../Command";

@injectable()
export class StartCommand extends Command {

  constructor(
    bot: Telegraf<SceneContext>,
    private readonly logger: ILogger,
  ) {
    super(bot)
  }

  handle(): void {
    this.bot.start(async (ctx) => {
      await ctx.reply('Hi, im bot');
    })
  }

};
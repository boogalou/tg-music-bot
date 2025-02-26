import { ICommand } from "../../domain/commands/ICommand";
import { Telegraf } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ILogger } from "../../infrastructure/services/config/logger/ILogger";
import { message } from "telegraf/filters";

@injectable()
export class FindCommand implements ICommand {
  constructor(
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {
  }

  handle(bot: Telegraf<SceneContext>): void {
    bot.command('find', async (ctx) => {
      ctx.reply('Enter your request');
      bot.on(message('text'), async (ctx) => {
        const trackTitle = ctx.message.text;
        ctx.reply(`Your request:  ${ trackTitle }`)
      })
    })
  }


}
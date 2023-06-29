import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { LoggerService } from "../services/logger.service";
import {SceneContext} from "telegraf/typings/scenes";

export class StartCommand extends Command {

  constructor(
      bot: Telegraf<SceneContext>,
      private readonly logger: LoggerService,
  ) {
    super(bot);
  }

  handle(): void {
    this.bot.start( async (ctx) => {
      await ctx.reply('Hi, im bot');
    })
  }

};
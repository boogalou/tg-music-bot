import { Telegraf } from "telegraf";

import { IBotContext } from "../../infrastructure/interfaces/IBotContext";

export interface ICommand {
  handle(bot: Telegraf<IBotContext>): void;
}
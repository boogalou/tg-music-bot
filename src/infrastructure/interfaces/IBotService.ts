import { IBotContext } from "./IBotContext";
import { Telegraf } from "telegraf";


export interface IBotService {
  registerCommands(bot:  Telegraf<IBotContext>): void;
}
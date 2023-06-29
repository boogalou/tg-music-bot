import { Bot } from "./bot";
import { ConfigService } from "./config/config.service";
import { LoggerService } from "./services/logger.service";

async function main() {
  try {
    const bot = new Bot(new ConfigService(), new LoggerService());
    bot.init();
  } catch (err) {
    console.error(err)
  }
}

main();

import {Bot} from "./bot";
import {LoggerService} from "./services/logger.service";

async function main() {
  try {
    const bot = new Bot(new LoggerService());
    bot.init();
  } catch (err) {
    console.error(err)
  }
}

main()

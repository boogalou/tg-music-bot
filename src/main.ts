import { Bot } from "./infrastructure/telegram/Bot";
import { container } from "./di/container";
import { TYPES } from "./di/types";
import { Logger } from "winston";
import { ILogger } from "./infrastructure/interfaces/ILogger";
import { IBot } from "./infrastructure/interfaces/IBot";

export async function main() {
  const logger = container.get<ILogger>(TYPES.ILogger);
  try {
    const bot = container.get<IBot>(TYPES.IBot);
    await bot.init();
  } catch (err) {
    logger.error("❌ Error starting bot:", err)
  }
}

main();

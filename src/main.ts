import { Bot } from "./infrastructure/services/impl/Bot";
import { container } from "./di/container";
import { TYPES } from "./di/types";

export async function main() {
  try {
    const bot = container.get<Bot>(TYPES.Bot);
    await bot.init();
  } catch (err) {
    console.error("❌ Error starting bot:", err)
  }
}

main();

import { Bot } from "./app/Bot";
import { container } from "./app/di/container";
import { TYPES } from "./app/di/types";

export async function main() {
  try {
   const bot = container.get<Bot>(TYPES.Bot);
    bot.init();
  } catch (err) {
    console.error(err)
  }
}

main();

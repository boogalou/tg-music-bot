import { Scenes, session, Telegraf } from "telegraf";
import 'dotenv/config';
import { start } from "./commands";
import { getSearch } from "./services/apiService";


const bot = new Telegraf<Scenes.SceneContext>(process.env.BOT_TOKEN!);
const stage = new Scenes.Stage<Scenes.SceneContext>();


export function botInit() {
  bot.use(session());
  bot.use(stage.middleware());

  bot.use((ctx, next) => next());

  bot.start(start);

  bot.on('text', async (ctx) => {
    const req = await ctx.message.text;
    const response = await getSearch(req);
    const { items } = response.data.response

    await ctx.replyWithAudio(items[0].url, { caption: `${items[0].artist} - ${items[0].title}` })
    await ctx.replyWithAudio(items[1].url, { caption: `${items[1].artist} - ${items[1].title}` })
    await ctx.replyWithAudio(items[2].url, { caption: `${items[2].artist} - ${items[2].title}` })
  })

  return bot;
}
import {message} from "telegraf/filters";
import {Markup, Scenes, Telegraf} from "telegraf";
import {Command} from "./command.class";
import {IBotContext} from "../context/context.interface";
import {AxiosResponse} from "axios";
import {ResponseData} from "../types/response.interface";
import {getLyricsGenius, search, searchYouTube} from "../services/api.service";
import {normalizeResponse} from "../utils/normalize-response";
import {LoggerService} from "../services/logger.service";
import {listFormatting} from "../utils/list-formatting";

export class SearchCommand extends Command {
  constructor(
      bot: Telegraf<Scenes.SceneContext>,
      private readonly logger: LoggerService,
  ) {
    super(bot);
  }

  handle(): void {
    try {
      this.bot.command('search', async (ctx) => {
        await ctx.reply('Enter your request');
        await this.bot.on(message('text'), async (ctx) => {
          const searchRequest = ctx.message.text;
          const searchResponse: AxiosResponse<ResponseData> = await search(searchRequest);

          if (!searchResponse.data) {
            await ctx.replyWithHTML('<pre>404 text not found</pre>');
            return '';
          }

          const tracks = normalizeResponse(searchResponse.data);
          const trackList = listFormatting(tracks);

          const inlineMessageRatingKeyboard: any[] = [];

          for (let i = 0; i < tracks.length; i++) {
            inlineMessageRatingKeyboard.push(
                Markup.button.callback(`${i + 1}`, `${i + 1}`)
            );
          };

          const replyOptions = Markup.inlineKeyboard(inlineMessageRatingKeyboard);

          await ctx.replyWithHTML(trackList, replyOptions);
          await this.bot.action(['1', '2', '3'], async (ctx) => {
            const trackIndex = Number(ctx.match.at(0));
            console.log(trackIndex)

            await ctx.replyWithAudio(tracks[trackIndex], Markup.inlineKeyboard([
                  Markup.button.callback('YouTube', `YouTube-${trackIndex}`),
                  Markup.button.callback('Song Lyrics', `Lyrics-${trackIndex}`),
                ]
            ));

            this.bot.action(`YouTube-${trackIndex}`, async (ctx) => {
              const result = ctx.match.at(0)?.split('-').at(1);
              if (result) {
                console.log(result);
                const response = await searchYouTube(tracks[+result].filename)
                const videoId = await response.data.items[0]['id']['videoId']
                if (!videoId) {
                  await ctx.replyWithHTML('<pre>404 video not found</pre>');
                  return;
                }
                await ctx.reply('https://www.youtube.com/watch?v=' + videoId);
              }
            });
            this.bot.action(`Lyrics-${trackIndex}`, async (ctx) => {
              const result = ctx.match.at(0)?.split('-').at(1);
              const lyrics = await getLyricsGenius(tracks[+result!].filename);
              if (!lyrics) {
                await ctx.replyWithHTML('<pre>404 text not found</pre>');
                return;
              }
              await ctx.replyWithHTML(`<pre>${lyrics}</pre>`);
            });
          });

        })
      });
    } catch (error) {
      this.logger.error(error);
    }
  };
};
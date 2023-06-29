import {message} from "telegraf/filters";
import {Markup, Scenes, Telegraf} from "telegraf";
import {Command} from "./command.class";
import {AxiosResponse} from "axios";
import {ResponseData} from "../types/response.interface";
import {getLyricsGenius, search, searchYouTube} from "../services/api.service";
import {normalizeResponse} from "../utils/normalize-response";
import {LoggerService} from "../services/logger.service";
import {listFormatting} from "../utils/list-formatting";
import {Tracklist} from "../types/tracklist.interface";

export class SearchCommand extends Command {
  state: {
    tracks: Tracklist[],
    searchRequest: string,
    selectedTrackIndex: number
  }

  constructor(
      bot: Telegraf<Scenes.SceneContext>,
      private readonly logger: LoggerService,
  ) {
    super(bot);
    this.state = {
      tracks: [],
      searchRequest: '',
      selectedTrackIndex: -1,
    }
  }

  handle(): void {
    try {
      this.bot.command('search', async (ctx) => {
        await ctx.reply('Enter your request');
        await this.bot.on(message('text'), async (ctx) => {
          const searchRequest = ctx.message.text;
          this.state.searchRequest = ctx.message.text
          const searchResponse: AxiosResponse<ResponseData> = await search(searchRequest);
          const items = searchResponse.data.response.items;

          if (items.length <= 0) {
            await ctx.replyWithHTML('<pre>No results found</pre>');
            return;
          }

          this.state.tracks = normalizeResponse(items);
          const trackList = listFormatting(this.state.tracks);

          const inlineMessageRatingKeyboard: any[] = [];

          for (let i = 0; i < this.state.tracks.length; i++) {
            inlineMessageRatingKeyboard.push(
                Markup.button.callback(`${i + 1}`, `${i}`)
            )
          }

          const replyOptions = Markup.inlineKeyboard(inlineMessageRatingKeyboard);

          await ctx.replyWithHTML(trackList, replyOptions);
          await this.bot.action(inlineMessageRatingKeyboard.map((_, index) => String(index)), async (ctx) => {
            const trackIndex = Number(ctx.match.at(0));
            this.state.selectedTrackIndex = trackIndex;

            await ctx.replyWithAudio(this.state.tracks[this.state.selectedTrackIndex], Markup.inlineKeyboard([
                  Markup.button.callback('YouTube', `YouTube-${this.state.selectedTrackIndex}`),
                  Markup.button.callback('Song Lyrics', `Lyrics-${this.state.selectedTrackIndex}`),
                ]
            ));

            this.bot.action(`YouTube-${this.state.selectedTrackIndex}`, async (ctx) => {
              const selectedTrackIndex = this.state.selectedTrackIndex;
              if (selectedTrackIndex) {
                const response = await searchYouTube(this.state.tracks[selectedTrackIndex].filename)
                const videoId = await response.data.items[0]['id']['videoId']
                if (!videoId) {
                  await ctx.replyWithHTML('<pre>404 video not found</pre>');
                  return;
                }
                await ctx.reply('https://www.youtube.com/watch?v=' + videoId);
              }
            });
            this.bot.action(`Lyrics-${trackIndex}`, async (ctx) => {
              const selectedTrackIndex = this.state.selectedTrackIndex;
              const lyrics = await getLyricsGenius(this.state.tracks[selectedTrackIndex].filename);
              if (!lyrics) {
                await ctx.replyWithHTML('<pre>404 text not found</pre>')
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
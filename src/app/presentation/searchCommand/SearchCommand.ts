import { Markup, Scenes, Telegraf } from "telegraf";
import { ILogger } from "../../config/logger/ILogger";
import { injectable } from "inversify";
import { ISearchViewModel } from "./ISearchViewModel";
import { message } from "telegraf/filters";
import { Command } from "../../Command";
import { TrackTitle } from "../../../domain/entities/TrackTitle";
import { Track } from "../../../domain/entities/Track";

@injectable()
export class SearchCommand extends Command {

  private readonly PROCESSING_MESSAGE = 'Search...'

  constructor(
    bot: Telegraf<Scenes.SceneContext>,
    private logger: ILogger,
    private searchViewModel: ISearchViewModel,
  ) {
    super(bot);
  }

  handle(): void {
    this.bot.command('find', (ctx) => {
      ctx.reply('Enter your request');
      this.handleMessage();
    });
  };

  private handleMessage() {
    this.bot.on(message('text'), async (ctx) => {
      const processingMessage = await ctx.reply(this.PROCESSING_MESSAGE);
      const trackTitle: TrackTitle = ctx.message.text;
      const trackItemList = await this.searchViewModel.searchAudioTrack(trackTitle);

      await ctx.deleteMessage(processingMessage.message_id);

      const fileTitle = this.formattingFilename(trackItemList);

      const buttons = trackItemList.map((item) => {
        return Markup.button.callback(`${ item.id }`, `${ item.id }`)
      });

      await ctx.replyWithHTML(fileTitle, Markup.inlineKeyboard(buttons));

      this.actionChooseTrack(buttons);

    });
  }

  private actionChooseTrack(buttons: any[]) {
    this.bot.action(buttons.map((btn) => btn.callback_data), async (ctx) => {
      const trackId = Number(ctx.match[0]);
      const trackList = this.searchViewModel.getTrackList();
      const result = trackList.find(track => track.id === trackId);

      if (!result) {
        await ctx.reply("Track not found.");
      }

      await ctx.replyWithAudio(
        { url: result?.url!, filename: result?.filename! },
        Markup.inlineKeyboard([
          Markup.button.callback('YouTube', `YouTube-${ result?.filename }`),
          Markup.button.callback('Song Lyrics', `Lyrics-${ result?.filename }`),
        ])
      );

      if (result) {
        this.handleActionButton(result);
      }
    });
  }

  private async handleYoutubeAction(ctx: Scenes.SceneContext, result: Track) {
    const videoId = await this.searchViewModel.searchMusicVideo(result.filename)
    await ctx.reply('https://www.youtube.com/watch?v=' + videoId);
  }

  private async handleLyricsAction(ctx: Scenes.SceneContext, result: Track) {
    const lyrics = await this.searchViewModel.searchLyrics(result.filename);
    await ctx.replyWithHTML(`<pre>${ lyrics }</pre>`);
  }

  private handleActionButton(result: Track) {
    this.bot.action(/YouTube-.+/, async (ctx) => {
      await this.handleYoutubeAction(ctx, result)
    });

    this.bot.action(/Lyrics-.+/, async (ctx) => {
      await this.handleLyricsAction(ctx, result)
    });
  };

  private formattingFilename(trackList: Track[]): string {
    return trackList.map((track) => {
      return `<strong>${ track.id }. ${ track?.filename }</strong>\n`
    }).join('');
  }
}

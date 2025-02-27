import { inject, injectable } from "inversify";
import { Markup, Telegraf } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";
import { message } from "telegraf/filters";


import { ICommand } from "../interfaces/ICommand";
import { TYPES } from "../../di/types";
import { ILogger } from "../../infrastructure/services/config/logger/ILogger";
import { Track } from "../../domain/models/Track";
import { IGetAudioTrackUseCase } from "../../application/interfaces/IGetAudioTrackUseCase";
import { IGetLyricsUseCase } from "../../application/interfaces/IGetLyricsUseCase";
import { IGetMusicVideoUseCase } from "../../application/interfaces/IGetMusicVideoUseCase";


@injectable()
export class FindCommand implements ICommand {
  constructor(
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
    @inject(TYPES.GetAudioTrackUseCase)
    private readonly getAudioTrackUseCase: IGetAudioTrackUseCase,
    @inject(TYPES.GetLyricsUseCase)
    private readonly getLyricsUseCase: IGetLyricsUseCase,
    @inject(TYPES.GetMusicVideoUseCase)
    private readonly getMusicVideoUseCase: IGetMusicVideoUseCase,
  ) {
  }

  handle(bot: Telegraf<SceneContext>): void {
    bot.command('find', async (ctx) => {
      ctx.reply('Enter your request');

      bot.on(message('text'), async (ctx) => {
        const processingMessage = await ctx.reply('Поиск трека...')
        const trackTitle = ctx.message.text;
        const trackList: Track[] = await this.getAudioTrackUseCase.execute(trackTitle);

        await ctx.deleteMessage(processingMessage.message_id);

        const fileTitle = this.formatingFilename(trackList);

        const buttons = trackList.map((track) => {
          return Markup.button.callback(`${ track.id }`, `${ track.id }`);
        });

        await ctx.replyWithHTML(fileTitle, Markup.inlineKeyboard(buttons));

        bot.action(buttons.map((btn) => btn.callback_data), async (ctx) => {
          const trackId = Number(ctx.match[0]);
          const selectedTrack = trackList.find((track) => track.id === trackId);

          if (!selectedTrack) {
            await ctx.reply('Track not found');
          }

          await ctx.replyWithAudio(
            { url: selectedTrack?.url!, filename: selectedTrack?.filename },
            Markup.inlineKeyboard([
              Markup.button.callback('YouTube', `YouTube-${ selectedTrack?.filename }`),
              Markup.button.callback('Song Lyrics', `Lyrics-${ selectedTrack?.filename }`),
            ])
          );

          bot.action(/Lyrics-.+/, async (ctx) => {
            const lyrics = await this.getLyricsUseCase.execute(selectedTrack?.filename!);
            await ctx.replyWithHTML(`<pre>${ lyrics }</pre>`);
          });

          bot.action(/YouTube-.+/, async (ctx) => {
            const videoId = await this.getMusicVideoUseCase.execute(selectedTrack?.filename!);
            await ctx.reply('https://www.youtube.com/watch?v=' + videoId);
          });
        });
      });
    });


  }


  private formatingFilename(trackList: Track[]): string {
    return trackList.map((track) => {
      return `<strong>${track.id}. ${track.filename}</strong>\n`
    }).join('');
  }

}

import { inject, injectable } from "inversify";
import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { ICommand } from "../interfaces/ICommand";
import { TYPES } from "../../di/types";
import { ILogger } from "../../infrastructure/interfaces/ILogger";
import { Track } from "../../domain/models/Track";
import { IGetAudioTrackUseCase } from "../../application/interfaces/IGetAudioTrackUseCase";
import { IGetLyricsUseCase } from "../../application/interfaces/IGetLyricsUseCase";
import { IGetMusicVideoUseCase } from "../../application/interfaces/IGetMusicVideoUseCase";
import { IBotContext } from "../../infrastructure/interfaces/IBotContext";
import axios from "axios";

@injectable()
export class FindCommand implements ICommand {
  private readonly MAX_AUDIO_SIZE = 50 * 1024 * 1024;

  constructor(
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
    @inject(TYPES.IGetAudioTrackUseCase)
    private readonly getAudioTrackUseCase: IGetAudioTrackUseCase,
    @inject(TYPES.IGetLyricsUseCase)
    private readonly getLyricsUseCase: IGetLyricsUseCase,
    @inject(TYPES.IGetMusicVideoUseCase)
    private readonly getMusicVideoUseCase: IGetMusicVideoUseCase,
  ) {
  }

  handle(bot: Telegraf<IBotContext>): void {
    bot.command('find', async (ctx) => {

      if (!ctx.session) {
        ctx.session = {
          trackList: [],
          selectedTrack: null,
        };
      }

      ctx.reply('Enter your request');
    });

    bot.on(message('text'), async (ctx) => {
      try {
      const processingMessage = await ctx.reply('Поиск трека...')
      const trackTitle = ctx.message.text;
      const trackList: Track[] = await this.getAudioTrackUseCase.execute(trackTitle);

      if (!trackList) {
        ctx.reply('Track not found')
        return;
      }

      ctx.session.trackList = trackList;

      await ctx.deleteMessage(processingMessage.message_id);
      const fileTitle = this.formatingFilename(trackList);

      const buttons = trackList.map((track) => {
        return Markup.button.callback(`${ track.id }`, `track_${ track.id }`);
      });

      await ctx.replyWithHTML(fileTitle, Markup.inlineKeyboard(buttons));

    } catch (err: any) {
      this.logger.error(err.message);
      await ctx.reply('Oops something went wrong');
      return;
    }

    });

    bot.action(/track_\d+/, async (ctx) => {
      const trackId = parseInt(ctx.match[0].replace('track_', ''), 10);
      const trackList = ctx.session.trackList || [];

      const selectedTrack = trackList.find((track) => track.id === trackId);

      if (!selectedTrack) {
        await ctx.reply('Track not found');
        return;
      }

      ctx.session.selectedTrack = selectedTrack;

      try {
        const fileSize = await this.getFileSize(selectedTrack.url);
        if (fileSize > this.MAX_AUDIO_SIZE) {
          await ctx.reply('The file is too large to send.');
          return;
        }

        await ctx.replyWithAudio(
          { url: selectedTrack.url, filename: selectedTrack.filename },
          Markup.inlineKeyboard([
            Markup.button.callback('YouTube', `YouTube-${selectedTrack.filename}`),
            Markup.button.callback('Song Lyrics', `Lyrics-${selectedTrack.filename}`),
          ])
        );
      } catch (err: any) {
        this.logger.error(`Error checking file size: ${err.message}`);
        await ctx.reply('Error checking file size.');
      }
    });

    bot.action(/Lyrics-.+/, async (ctx) => {
      const selectedTrack = ctx.session.selectedTrack;

      try {
        const lyrics = await this.getLyricsUseCase.execute(selectedTrack?.filename!);
        if (!lyrics) {
          await ctx.replyWithHTML(`<pre>Track not Found</pre>`);
          return;
        }
        await ctx.replyWithHTML(`<pre>${ lyrics }</pre>`);

      } catch (err: any) {
        this.logger.error(`Error fetching lyrics: ${err.message}`);
        await ctx.replyWithHTML(`<pre>Failed to fetch lyrics</pre>`);
        return
      }
    });

    bot.action(/YouTube-.+/, async (ctx) => {
      const selectedTrack = ctx.session.selectedTrack;

      try {
        const videoId = await this.getMusicVideoUseCase.execute(selectedTrack?.filename!);
        await ctx.reply('https://www.youtube.com/watch?v=' + videoId);
      } catch (err: any) {
        this.logger.error(`Error fetching lyrics: ${err.message}`);
        await ctx.replyWithHTML(`<pre>Failed to fetch music video</pre>`);
        return;
      }
    });

  }


  private formatingFilename(trackList: Track[]): string {
    return trackList
      .map((track) => `<strong>${track.id}. ${track.filename}</strong>\n`)
      .join('');
  }

  private async getFileSize(url: string) {
    try {
      const response = await axios.head(url);
      return parseInt(response.headers['content-length'], 10);
    } catch (error) {
      throw new Error('Unable to retrieve file size');
    }
  }

}

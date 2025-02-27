import { inject, injectable } from "inversify";

import { ILyricsProvider } from "../../domain/repositories/ILyricsProvider";
import { IGetLyricsUseCase } from "../interfaces/IGetLyricsUseCase";
import { TYPES } from "../../di/types";

@injectable()
export class GetLyricsUseCase implements IGetLyricsUseCase {
  constructor(
    @inject(TYPES.LyricsProvider)
    private readonly provider: ILyricsProvider) {}

   async execute(trackTitle: string): Promise<string> {
     return await this.provider.getLyrics(trackTitle);
  }
}
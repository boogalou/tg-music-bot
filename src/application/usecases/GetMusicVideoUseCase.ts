import { inject, injectable } from "inversify";

import { IMusicVideoProvider } from "../../domain/repositories/IMusicVideoProvider";
import { TYPES } from "../../di/types";
import { IGetMusicVideoUseCase } from "../interfaces/IGetMusicVideoUseCase";


@injectable()
export class GetMusicVideoUseCase implements IGetMusicVideoUseCase{
  constructor(
    @inject(TYPES.IMusicVideoProvider)
    private readonly provider: IMusicVideoProvider
  ) {
  }

 async execute(trackTitle: string): Promise<string> {
    return await this.provider.getMusicVideo(trackTitle);
  }
}
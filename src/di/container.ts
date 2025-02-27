import { Container } from "inversify";

import { Bot } from "../infrastructure/services/Bot";
import { TYPES } from "./types";
import { ILogger } from "../infrastructure/services/config/logger/ILogger";
import { LoggerService } from "../infrastructure/services/config/logger/LoggerService";
import { IEnvConfigService } from "../infrastructure/services/config/env/IEnvConfigService";
import { EnvConfigService } from "../infrastructure/services/config/env/EnvConfigService";
import { BotService } from "../application/services/BotService";
import { ICommand } from "../presentation/interfaces/ICommand";
import { StartCommand } from "../presentation/commands/StartCommand";
import { FindCommand } from "../presentation/commands/FindCommand";
import { GetLyricsUseCase } from "../application/usecases/GetLyricsUseCase";
import { GetMusicVideoUseCase } from "../application/usecases/GetMusicVideoUseCase";
import { IAudioProvider } from "../domain/repositories/IAudioProvider";
import { AudioProvider } from "../infrastructure/providers/AudioProvider";
import { IGetAudioTrackUseCase } from "../application/interfaces/IGetAudioTrackUseCase";
import { GetAudioTrackUseCase } from "../application/usecases/GetAudioTrackUseCase";
import { IGetLyricsUseCase } from "../application/interfaces/IGetLyricsUseCase";
import { IGetMusicVideoUseCase } from "../application/interfaces/IGetMusicVideoUseCase";
import { ILyricsProvider } from "../domain/repositories/ILyricsProvider";
import { IMusicVideoProvider } from "../domain/repositories/IMusicVideoProvider";
import { LyricsProvider } from "../infrastructure/providers/LyricsProvider";
import { MusicVideoProvider } from "../infrastructure/providers/MusicVideoProvider";


const container = new Container();
// Configuration
container.bind<ILogger>(TYPES.ILogger).to(LoggerService);
container.bind<IEnvConfigService>(TYPES.IConfigService).to(EnvConfigService);

// Bot
container.bind<Bot>(TYPES.Bot).to(Bot);
container.bind<BotService>(TYPES.BotService).to(BotService);

// UseCases
container.bind<IGetAudioTrackUseCase>(TYPES.GetAudioTrackUseCase).to(GetAudioTrackUseCase);
container.bind<IGetLyricsUseCase>(TYPES.GetLyricsUseCase).to(GetLyricsUseCase);
container.bind<IGetMusicVideoUseCase>(TYPES.GetMusicVideoUseCase).to(GetMusicVideoUseCase);

// Commands
container.bind<ICommand>(TYPES.StartCommand).to(StartCommand);
container.bind<ICommand>(TYPES.FindCommand).to(FindCommand);

container.bind<ICommand[]>(TYPES.ICommand).toDynamicValue(() => [
  container.get<ICommand>(TYPES.StartCommand),
  container.get<ICommand>(TYPES.FindCommand),
]).inSingletonScope();

// Providers
container.bind<IAudioProvider>(TYPES.AudioProvider).to(AudioProvider);
container.bind<ILyricsProvider>(TYPES.LyricsProvider).to(LyricsProvider);
container.bind<IMusicVideoProvider>(TYPES.MusicVideoProvider).to(MusicVideoProvider);
export { container };
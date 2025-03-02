import { Container } from "inversify";

import { Bot } from "../infrastructure/telegram/Bot";
import { TYPES } from "./types";
import { ILogger } from "../infrastructure/interfaces/ILogger";
import { LoggerService } from "../infrastructure/services/LoggerService";
import { IEnvConfigService } from "../infrastructure/interfaces/IEnvConfigService";
import { EnvConfigService } from "../infrastructure/services/EnvConfigService";
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
import { IBotService } from "../infrastructure/interfaces/IBotService";
import { IBot } from "../infrastructure/interfaces/IBot";



const container = new Container();

// Configuration
container.bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
container.bind<IEnvConfigService>(TYPES.IConfigService).to(EnvConfigService);

// Bot
container.bind<IBot>(TYPES.IBot).to(Bot);
container.bind<IBotService>(TYPES.IBotService).to(BotService);

// UseCases
container.bind<IGetAudioTrackUseCase>(TYPES.IGetAudioTrackUseCase).to(GetAudioTrackUseCase);
container.bind<IGetLyricsUseCase>(TYPES.IGetLyricsUseCase).to(GetLyricsUseCase);
container.bind<IGetMusicVideoUseCase>(TYPES.IGetMusicVideoUseCase).to(GetMusicVideoUseCase);

// Commands
container.bind<ICommand>(TYPES.IStartCommand).to(StartCommand);
container.bind<ICommand>(TYPES.IFindCommand).to(FindCommand);

container.bind<ICommand[]>(TYPES.ICommand).toDynamicValue(() => [
  container.get<ICommand>(TYPES.IStartCommand),
  container.get<ICommand>(TYPES.IFindCommand),
]).inSingletonScope();

// Providers
container.bind<IAudioProvider>(TYPES.IAudioProvider).to(AudioProvider);
container.bind<ILyricsProvider>(TYPES.ILyricsProvider).to(LyricsProvider);
container.bind<IMusicVideoProvider>(TYPES.IMusicVideoProvider).to(MusicVideoProvider);
export { container };
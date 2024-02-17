import { Container } from "inversify";
import { Bot } from "../Bot";
import { TYPES } from "./types";
import { ILogger } from "../config/logger/ILogger";
import { LoggerService } from "../config/logger/LoggerService";
import { IEnvConfigService } from "../config/env/IEnvConfigService";
import { EnvConfigService } from "../config/env/EnvConfigService";
import { IRemoteService } from "../../data/api/IRemoteService";
import { RemoteService } from "../../data/api/RemoteService";
import { TrackRepositoryImpl } from "../../data/repositories/TrackRepositoryImpl";
import { ITrackRepository } from "../../domain/repositories/ITrackRepository";
import { SearchViewModel } from "../presentation/searchCommand/SearchViewModel";
import { ISearchViewModel } from "../presentation/searchCommand/ISearchViewModel";
import { SearchCommand } from "../presentation/searchCommand/SearchCommand";
import { StartCommand } from "../presentation/startCommand/StartCommand";


const container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot);
container.bind<ILogger>(TYPES.ILogger).to(LoggerService);
container.bind<IEnvConfigService>(TYPES.IConfigService).to(EnvConfigService);
container.bind<IRemoteService>(TYPES.IRemoteService).to(RemoteService);
container.bind<ITrackRepository>(TYPES.TrackRepository).to(TrackRepositoryImpl);
container.bind<ISearchViewModel>(TYPES.ISearchViewModel).to(SearchViewModel);
container.bind<SearchCommand>(TYPES.SearchCommand).to(SearchCommand);
container.bind<StartCommand>(TYPES.StartCommand).to(StartCommand);


export { container };
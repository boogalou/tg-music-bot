import { Container } from "inversify";
import { Bot } from "../infrastructure/services/impl/Bot";
import { TYPES } from "./types";
import { ILogger } from "../infrastructure/services/config/logger/ILogger";
import { LoggerService } from "../infrastructure/services/config/logger/LoggerService";
import { IEnvConfigService } from "../infrastructure/services/config/env/IEnvConfigService";
import { EnvConfigService } from "../infrastructure/services/config/env/EnvConfigService";
import { BotService } from "../application/services/BotService";
import { ICommand } from "../domain/commands/ICommand";
import { StartCommand } from "../presentation/commands/StartCommand";
import { FindCommand } from "../presentation/commands/FindCommand";


const container = new Container();
// Configuration
container.bind<ILogger>(TYPES.ILogger).to(LoggerService);
container.bind<IEnvConfigService>(TYPES.IConfigService).to(EnvConfigService);

// Bot
container.bind<Bot>(TYPES.Bot).to(Bot);
container.bind<BotService>(TYPES.BotService).to(BotService);

// Commands
container.bind<ICommand>(TYPES.StartCommand).to(StartCommand);
container.bind<ICommand>(TYPES.FindCommand).to(FindCommand);

container.bind<ICommand[]>(TYPES.ICommand).toDynamicValue(() => [
  container.get<ICommand>(TYPES.StartCommand),
  container.get<ICommand>(TYPES.FindCommand),
]).inSingletonScope();

export { container };
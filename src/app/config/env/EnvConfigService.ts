import { config, DotenvParseOutput } from "dotenv";
import { IEnvConfigService } from "./IEnvConfigService";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/ILogger";
import { TYPES } from "../../di/types";

@injectable()
export class EnvConfigService implements IEnvConfigService {
  private readonly config: DotenvParseOutput;

  constructor(
   @inject(TYPES.ILogger) private readonly logger: ILogger
  ) {
    const {error, parsed} = config();
    if (error || !parsed) {
      const errorMessage: string = 'env file not found or empty';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.config = parsed;
  }

  public get(key: string): string {
    const result = this.config[key];
    if (!result) {
      const errorMessage: string = 'token invalid';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    return result;
  }
}

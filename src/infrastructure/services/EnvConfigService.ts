import { config, DotenvParseOutput } from "dotenv";

import { IEnvConfigService } from "../interfaces/IEnvConfigService";
import { inject, injectable } from "inversify";
import { ILogger } from "../interfaces/ILogger";
import { TYPES } from "../../di/types";

@injectable()
export class EnvConfigService implements IEnvConfigService {
  private readonly config: DotenvParseOutput | NodeJS.ProcessEnv;

  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger
  ) {
    const { error, parsed } = config();

    if (error || !parsed) {
      this.logger.warn('.env file not found or empty, falling back to environment variables.');
    }

    this.config = parsed || process.env;
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

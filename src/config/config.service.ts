import { DotenvParseOutput, config } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {
  private readonly config: DotenvParseOutput;

  constructor() {
    const {error, parsed} = config();
    if (error || !parsed) {
      throw new Error('env file not found or empty');
    }

    this.config = parsed;
  }

  public get(key: string): string {
    const result = this.config[key];
    if (!result) {
      throw new Error('token invalid');
    }
    return result;
  }
}

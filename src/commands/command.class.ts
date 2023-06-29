import {Scenes, Telegraf} from "telegraf";
import { IBotContext } from "../context/context.interface";

export abstract class Command {
  protected constructor(public bot: Telegraf<Scenes.SceneContext>) {};
  abstract handle(): void
}
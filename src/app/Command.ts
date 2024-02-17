import {Scenes, Telegraf} from "telegraf";

export abstract class Command {
  protected constructor(public bot: Telegraf<Scenes.SceneContext>) {};
  abstract handle(): void
}
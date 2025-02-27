import {Scenes, Telegraf} from "telegraf";

export interface ICommand {
  handle(bot: Telegraf<Scenes.SceneContext>): void;
}
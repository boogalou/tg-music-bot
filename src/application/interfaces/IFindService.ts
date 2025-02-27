import { Scenes } from "telegraf";


export interface IFindService {
  processRequest (ctx: Scenes.SceneContext): Promise<void>
}
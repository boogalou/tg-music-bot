import { Context } from "telegraf";

import { Track } from "../../domain/models/Track";

export interface SessionData {
  trackList: Track[];
  selectedTrack: Track | null;
}

export interface IBotContext extends Context {
  session: SessionData;
}
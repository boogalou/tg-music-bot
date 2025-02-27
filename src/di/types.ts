export const TYPES = {

  ILogger: Symbol.for('ILogger'),
  IConfigService: Symbol.for('IConfigService'),


  Bot: Symbol.for('Bot'),
  BotService: Symbol.for('BotService'),
  FindService: Symbol.for('FindService'),

  ICommand: Symbol.for('ICommand'),

  // presentation/commands
  StartCommand: Symbol.for('StartCommand'),
  FindCommand: Symbol.for('FindCommand'),

  // infrastructure/providers
  AudioProvider: Symbol.for('AudioProvider'),
  LyricsProvider: Symbol.for('LyricsProvider'),
  MusicVideoProvider: Symbol.for('MusicVideoProvider'),

  // application/usecases
  GetAudioTrackUseCase: Symbol.for('GetAudioTrackUseCase'),
  GetLyricsUseCase: Symbol.for('GetLyricsUseCase'),
  GetMusicVideoUseCase: Symbol.for('GetMusicVideoUseCase')
} as const;


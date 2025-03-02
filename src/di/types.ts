export const TYPES = {

  IBot: Symbol.for('IBot'),
  ILogger: Symbol.for('ILogger'),
  IConfigService: Symbol.for('IConfigService'),

  ICommand: Symbol.for('ICommand'),
  IBotService: Symbol.for('IBotService'),

  // presentation/commands
  IStartCommand: Symbol.for('IStartCommand'),
  IFindCommand: Symbol.for('IFindCommand'),

  // infrastructure/providers
  IAudioProvider: Symbol.for('IAudioProvider'),
  ILyricsProvider: Symbol.for('ILyricsProvider'),
  IMusicVideoProvider: Symbol.for('IMusicVideoProvider'),

  // application/usecases
  IGetAudioTrackUseCase: Symbol.for('IGetAudioTrackUseCase'),
  IGetLyricsUseCase: Symbol.for('IGetLyricsUseCase'),
  IGetMusicVideoUseCase: Symbol.for('IGetMusicVideoUseCase')
} as const;


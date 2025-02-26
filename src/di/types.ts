export const TYPES = {

  ILogger: Symbol.for('ILogger'),
  IConfigService: Symbol.for('IConfigService'),


  Bot: Symbol.for('Bot'),
  BotService: Symbol.for('BotService'),

  ICommand: Symbol.for('ICommand'),

  StartCommand: Symbol.for('StartCommand'),
  FindCommand: Symbol.for('FindCommand'),
} as const;


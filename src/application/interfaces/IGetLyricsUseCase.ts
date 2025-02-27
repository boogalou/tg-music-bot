export interface IGetLyricsUseCase {
  execute(trackTitle: string): Promise<string>;
}
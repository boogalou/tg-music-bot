export interface IGetMusicVideoUseCase {
  execute(trackTitle: string): Promise<string>;
}
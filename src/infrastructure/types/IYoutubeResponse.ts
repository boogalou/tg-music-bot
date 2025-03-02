export type YoutubeApiResponse = {
  items: YoutubeVideo[]
}

export type YoutubeVideo = {
  kind: string;
  etag: string;
  id: YoutubeVideoData
};

export type YoutubeVideoData = {
  kind: string;
  videoId: string;
}
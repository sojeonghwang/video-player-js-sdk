export interface PlayerOptions {
  videoElement: string;
  videoSrc: string;
}

export interface VideoInfo {
  videoCodec?: string;
  videoTrackSize: number;
  videoTrackBitrate: number;
  audioCodec?: string;
  audioTrackSize: number;
  audioTrackBitrate: number;
  brands: string;
}

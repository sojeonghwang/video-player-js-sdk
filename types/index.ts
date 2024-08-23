export interface PlayerOptions {
  videoElement: string;
  videoSrc: string;
  size?: VideoSize;
}

export interface VideoSize {
  width: number;
  height: number;
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

export type PlayRate = 0.5 | 1 | 1.3 | 1.5 | 2;

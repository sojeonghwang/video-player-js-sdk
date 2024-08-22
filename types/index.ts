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

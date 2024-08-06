import { PlayerOptions, VideoInfo } from "../types";

import { Codec } from "./codec";

class Player extends Codec {
  private videoElement: HTMLVideoElement;
  public videoCodecInfo: VideoInfo | null;

  constructor(options: PlayerOptions) {
    super();
    const videoElement = document.getElementById(
      options.videoElement
    ) as HTMLVideoElement;
    if (!videoElement) {
      throw new Error(`Element with id ${options.videoElement} not found`);
    }

    if (!options.videoSrc) {
      throw new Error("videoSrc not found");
    }

    this.videoElement = videoElement;
    this.videoElement.src = options.videoSrc;
    this.videoCodecInfo = null;
  }

  /**
   * Play video
   */
  play(): void {
    try {
      this.videoElement.play();
    } catch (exception) {
      console.error("Failed to play video:", exception);
    }
  }

  /**
   * Stop video
   */
  pause(): void {
    try {
      this.videoElement.pause();
    } catch (exception) {
      console.error("Failed to pause video:", exception);
    }
  }

  /**
   * get video, audio codec info
   */
  async getVideoCodec(): Promise<{
    videoCodec: string;
    videoTrackSize: number;
    videoTrackBitrate: number;
    audioCodec: string;
    audioTrackSize: number;
    audioTrackBitrate: number;
    brands: string;
  }> {
    const videoInfo = await this.getVideoInfo(this.videoElement.src);
    return videoInfo;
  }
}

export default Player;

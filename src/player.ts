import { PlayerOptions, PlayRate, VideoInfo } from "../types";
import Hls from "hls.js";
import { DEFAULT_VIDEO_SIZE } from "./constants";
import { HlsPlayer } from "./hls";

class Player extends HlsPlayer {
  public videoCodecInfo: VideoInfo | null;
  public videoSize: { width: number; height: number };

  constructor(options: PlayerOptions) {
    const videoElement = document.getElementById(
      options.videoElement
    ) as HTMLVideoElement;
    super(videoElement, options.videoSrc);

    if (!videoElement) {
      throw new Error(`Element with id ${options.videoElement} not found`);
    }

    if (!options.videoSrc) {
      throw new Error("videoSrc not found");
    }

    this.videoElement.src = options.videoSrc;
    this.videoCodecInfo = null;
    this.videoSize = options.size ?? DEFAULT_VIDEO_SIZE;
    this.videoElement.width = this.videoSize.width;
    this.videoElement.height = this.videoSize.height;
  }

  /**
   * Play video
   */
  play(): void {
    try {
      if (this.videoContentType !== "video/mp4") {
        //m3u8
        if (Hls.isSupported()) {
          this.playByHls();
          return;
        }
      }

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
      if (this.videoContentType !== "video/mp4") {
        //m3u8
        if (Hls.isSupported()) {
          this.pauseByHls();
          return;
        }
      }

      this.videoElement.pause();
    } catch (exception) {
      console.error("Failed to pause video:", exception);
    }
  }
  /**
   * Change play rate
   */
  changePlayRate(rate: PlayRate): void {
    try {
      this.videoElement.playbackRate = rate;
    } catch (exception) {
      console.error("Failed to change play rate:", exception);
    }
  }

  /**
   * get video, audio codec info
   */
  async getVideoCodec(): Promise<VideoInfo | string[]> {
    if (this.videoContentType !== "video/mp4") {
      return this.codes;
    }

    const videoInfo = await this.getVideoInfo(this.videoElement.src);
    return videoInfo;
  }
}

export default Player;

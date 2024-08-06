import { PlayerOptions } from "../types";
import mp4box from "mp4box";

class Player {
  private videoElement: HTMLVideoElement;

  constructor(options: PlayerOptions) {
    const videoElement = document.getElementById(
      options.videoElement
    ) as HTMLVideoElement;
    if (!videoElement) {
      throw new Error(`Element with id ${options.videoElement} not found`);
    }

    this.videoElement = videoElement;
    this.videoElement.src = options.videoSrc;
  }

  /**
   * Play video.
   */
  play(): void {
    try {
      this.videoElement.play();
    } catch (exception) {
      console.error("Failed to play video:", exception);
    }
  }

  /**
   * Stop video.
   */
  pause(): void {
    try {
      this.videoElement.pause();
    } catch (exception) {
      console.error("Failed to pause video:", exception);
    }
  }

  getVideoCodec() {
    console.log("?mp4box", mp4box);
    //
  }
}

export default Player;

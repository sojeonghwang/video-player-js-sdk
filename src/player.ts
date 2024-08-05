import { PlayerOptions } from "./types";

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

  play() {
    this.videoElement.play();
  }

  pause() {
    this.videoElement.pause();
  }
}

export default Player;

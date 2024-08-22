import Hls from "hls.js";
import { Codec } from "./codec";
import { parseCodecs } from "./util/parse";

export class HlsPlayer extends Codec {
  public videoElement: HTMLVideoElement;
  private hls: Hls;
  private isHlsLoad: boolean;
  private isReady: boolean;
  public videoContentType: string | null;
  public codes: string[];

  constructor(videoElement: HTMLVideoElement, m3u8Src: string) {
    super();
    this.videoElement = videoElement;
    this.hls = new Hls();
    this.isHlsLoad = false;
    this.isReady = false;
    this.videoContentType = null;
    this.fetchM3U8(m3u8Src);
    this.codes = [];
  }

  async fetchM3U8(m3u8Src: string) {
    try {
      const response = await fetch(m3u8Src);

      this.videoContentType = response.headers.get("content-type");

      const text = await response.text();
      this.codes = parseCodecs(text);
    } catch (exception) {
      console.error(`[fetchM3U8] error ${exception}`);
    }
  }

  setUpHls(callback?: () => void): void {
    this.isHlsLoad = true;
    this.hls.loadSource(this.videoElement.src);
    this.hls.attachMedia(this.videoElement);
    this.hls.startLoad();

    // 이벤트 핸들링 =====
    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      this.isReady = true;
      callback?.();
    });

    this.hls.on(Hls.Events.ERROR, (_, data) => {
      console.error("HLS 오류:", data);
    });
  }

  playByHls(): void {
    if (this.isReady) {
      this.videoElement.play();
      return;
    }

    if (!this.isHlsLoad) {
      this.setUpHls(() => {
        this.videoElement.play();
      });
    }
  }

  pauseByHls(): void {
    if (this.isReady) {
      this.videoElement.pause();
      return;
    }

    if (!this.isHlsLoad) {
      this.setUpHls(() => {
        this.videoElement.pause();
      });
    }
  }
}

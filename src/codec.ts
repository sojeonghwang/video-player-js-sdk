import MP4Box, { MP4ArrayBuffer } from "mp4box";
import { VideoInfo } from "../types";

export class Codec {
  isMp4BoxOnReady: boolean;
  mp4boxfile: MP4Box.MP4File;

  constructor() {
    this.isMp4BoxOnReady = false;
    this.mp4boxfile = MP4Box.createFile();
  }

  showVideoInfo(
    info: MP4Box.MP4Info,
    resolve: (value: VideoInfo) => void
  ): void {
    const [videoTrack, audioTrack] = info.tracks;

    this.isMp4BoxOnReady = true;

    resolve({
      videoCodec: videoTrack.codec,
      videoTrackSize: videoTrack.size,
      videoTrackBitrate: videoTrack.bitrate,
      audioCodec: audioTrack.codec,
      audioTrackSize: audioTrack.size,
      audioTrackBitrate: audioTrack.bitrate,
      brands: info.brands.join(","),
    });
  }

  bindMp4box(
    reject: (reason?: string) => void,
    resolve: (value: VideoInfo) => void
  ): void {
    this.mp4boxfile.onReady = (info: MP4Box.MP4Info) => {
      this.isMp4BoxOnReady = true;
      this.showVideoInfo(info, resolve);
    };
    this.mp4boxfile.onError = (exception) => {
      this.isMp4BoxOnReady = true;
      reject(`mp4box on error ${exception}`);
    };
  }

  fetchMp4ByMp4Box(
    start: number,
    end: number,
    aseetUrl: string,
    reject: (reason?: string) => void
  ) {
    const range = `bytes=${start}-${end}`;
    fetch(aseetUrl, {
      headers: {
        range,
      },
    })
      .then((response) => {
        return response.arrayBuffer();
      })
      .then((arrayBuffer: ArrayBuffer) => {
        const mp4ArrayBuffer = arrayBuffer as MP4ArrayBuffer;
        mp4ArrayBuffer.fileStart = start;

        this.mp4boxfile.appendBuffer(mp4ArrayBuffer);

        if (!this.isMp4BoxOnReady) {
          this.fetchMp4ByMp4Box(end, end + 100000, aseetUrl, reject);
        }
      })
      .catch((exception) => {
        reject(`video request error ${exception}`);
      });
  }

  getVideoInfo(aseetUrl: string): Promise<VideoInfo> {
    return new Promise(
      async (
        resolve: (value: VideoInfo) => void,
        reject: (reason?: string) => void
      ) => {
        await this.bindMp4box(reject, resolve);
        await this.fetchMp4ByMp4Box(0, 100000, aseetUrl, reject);
      }
    );
  }
}

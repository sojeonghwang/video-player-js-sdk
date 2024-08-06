import MP4Box, { MP4ArrayBuffer } from "mp4box";

export class Codec {
  getVideoInfo(ASSET_URL: string): Promise<{
    videoCodec: string;
    videoTrackSize: number;
    videoTrackBitrate: number;
    audioCodec: string;
    audioTrackSize: number;
    audioTrackBitrate: number;
    brands: string;
  }> {
    return new Promise((resolve, reject): void => {
      const mp4boxfile = MP4Box.createFile();

      playMp4(0, 100000);

      let isMp4BoxOnReady = false;

      function playMp4(start: number, end: number) {
        bindMp4box();
        const range = `bytes=${start}-${end}`;
        fetch(ASSET_URL, {
          headers: {
            range,
          },
        })
          .then(function (response) {
            return response.arrayBuffer();
          })
          .then((arrayBuffer: ArrayBuffer) => {
            const mp4ArrayBuffer = arrayBuffer as MP4ArrayBuffer;
            mp4ArrayBuffer.fileStart = start;
            mp4boxfile.appendBuffer(mp4ArrayBuffer);

            if (!isMp4BoxOnReady) {
              playMp4(end, end + 100000);
            }
          })
          .catch((exception) => {
            reject(`video request error ${exception}`);
          });
      }

      function bindMp4box(): void {
        mp4boxfile.onReady = (info: MP4Box.MP4Info) => {
          isMp4BoxOnReady = true;
          showVideoInfo(info);
        };
        mp4boxfile.onError = (exception) => {
          isMp4BoxOnReady = true;
          reject(`mp4box on error ${exception}`);
        };
      }

      function showVideoInfo(info: MP4Box.MP4Info): void {
        const [videoTrack, audioTrack] = info.tracks;

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
    });
  }
}

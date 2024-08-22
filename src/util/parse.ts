export function parseCodecs(m3u8Content: string) {
  const codecRegex = /#EXT-X-STREAM-INF:.*CODECS="([^"]+)"/g;
  let match;
  const codecs = [];

  while ((match = codecRegex.exec(m3u8Content)) !== null) {
    codecs.push(match[1]);
  }

  return codecs;
}

import { site } from '../src/data.js';

const TTL = 10 * 60 * 1000;
let cache;
let pending;

function decodeText(value) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  return value.replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1').replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (match, entity) => {
    if (!entity.startsWith('#')) return entities[entity.toLowerCase()] ?? match;
    const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : match;
  });
}

// 고정된 YouTube Atom 피드에서 필요한 필드만 읽습니다. 외부 엔티티는 처리하지 않습니다.
export function parseVideoFeed(xml) {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('지원하지 않는 피드 형식입니다.');
  const tag = (entry, name) => entry.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]?.trim() ?? '';
  const seen = new Set();
  const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
    const id = tag(entry, 'yt:videoId');
    const title = decodeText(tag(entry, 'title'));
    const publishedAt = tag(entry, 'published');
    if (!/^[\w-]{11}$/.test(id) || !title || !Number.isFinite(Date.parse(publishedAt)) || tag(entry, 'yt:channelId') !== site.youtube.channelId || seen.has(id)) return [];
    seen.add(id);
    return [{ id, title, publishedAt, image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, url: `https://www.youtube.com/watch?v=${id}` }];
  });
  videos.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  if (!videos.length) throw new Error('공식 채널의 영상 정보를 찾지 못했습니다.');
  return videos.slice(0, 5);
}

export function fetchVideoFeed() {
  if (cache && Date.now() - cache.time < TTL) return Promise.resolve(cache.data);
  if (pending) return pending;
  pending = (async () => {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${site.youtube.channelId}`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`YouTube 피드 응답 오류: ${response.status}`);
    const data = { channelId: site.youtube.channelId, fetchedAt: new Date().toISOString(), videos: parseVideoFeed(await response.text()) };
    cache = { time: Date.now(), data };
    return data;
  })().finally(() => { pending = undefined; });
  return pending;
}

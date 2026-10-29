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

export function parseChannelPage(html) {
  const raw = html.match(/(?:var\s+)?ytInitialData\s*=\s*(\{[^\n]+?\});<\/script>/)?.[1];
  if (!raw) throw new Error('채널 영상 데이터를 찾지 못했습니다.');
  const data = JSON.parse(raw);
  if (data.metadata?.channelMetadataRenderer?.externalId !== site.youtube.channelId) throw new Error('공식 채널이 아닙니다.');
  const tabs = data.contents?.twoColumnBrowseResultsRenderer?.tabs ?? [];
  const grid = tabs.find(tab => tab.tabRenderer?.selected)?.tabRenderer?.content?.richGridRenderer;
  const seen = new Set();
  const videos = (grid?.contents ?? []).flatMap(item => {
    const content = item.richItemRenderer?.content;
    const modern = content?.lockupViewModel;
    const legacy = content?.videoRenderer;
    const id = modern?.contentId ?? legacy?.videoId;
    const title = modern?.metadata?.lockupMetadataViewModel?.title?.content ?? legacy?.title?.runs?.map(run => run.text).join('');
    if (!/^[\w-]{11}$/.test(id) || !title || seen.has(id) || legacy?.upcomingEventData) return [];
    if (modern && modern.contentType !== 'LOCKUP_CONTENT_TYPE_VIDEO') return [];
    seen.add(id);
    return [{ id, title }];
  });
  if (!videos.length) throw new Error('공식 채널의 영상 목록이 비어 있습니다.');
  return videos.slice(0, 5);
}

async function fetchChannelVideos() {
  const response = await fetch(`https://www.youtube.com/channel/${site.youtube.channelId}/videos`, { signal: AbortSignal.timeout(6000) });
  if (!response.ok) throw new Error(`채널 응답 오류: ${response.status}`);
  const candidates = parseChannelPage(await response.text());
  const videos = await Promise.all(candidates.map(async video => {
    const page = await fetch(`https://www.youtube.com/watch?v=${video.id}`, { signal: AbortSignal.timeout(6000) });
    if (!page.ok) throw new Error(`영상 응답 오류: ${page.status}`);
    const html = await page.text();
    const channelId = html.match(/"channelId":"([^"]+)"/)?.[1];
    const publishedAt = html.match(/"publishDate":"([^"]+)"/)?.[1];
    if (channelId !== site.youtube.channelId || !Number.isFinite(Date.parse(publishedAt))) throw new Error('영상 출처 또는 게시일을 확인하지 못했습니다.');
    return { ...video, publishedAt, image: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`, url: `https://www.youtube.com/watch?v=${video.id}` };
  }));
  return videos.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function fetchVideoFeed() {
  if (cache && Date.now() - cache.time < TTL) return Promise.resolve(cache.data);
  if (pending) return pending;
  pending = (async () => {
    let videos;
    let source = 'rss';
    try {
      const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${site.youtube.channelId}`, { signal: AbortSignal.timeout(4000) });
      if (!response.ok) throw new Error(`YouTube 피드 응답 오류: ${response.status}`);
      videos = parseVideoFeed(await response.text());
    } catch {
      videos = await fetchChannelVideos();
      source = 'channel';
    }
    const data = { channelId: site.youtube.channelId, fetchedAt: new Date().toISOString(), source, videos };
    cache = { time: Date.now(), data };
    return data;
  })().finally(() => { pending = undefined; });
  return pending;
}

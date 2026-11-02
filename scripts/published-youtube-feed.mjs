import { site } from '../src/data.js';

const URL = 'https://raw.githubusercontent.com/JinKiHwan/blackcombat/refs/heads/codex/youtube-feed/public/data/youtube.json';
const TTL = 5 * 60 * 1000;
let cache;

export function validatePublishedFeed(data, now = Date.now()) {
  const fetched = Date.parse(data.fetchedAt);
  if (data.channelId !== site.youtube.channelId || !Number.isFinite(fetched) || fetched > now + 60000) throw new Error('Invalid published feed');
  const videos = (Array.isArray(data.videos) ? data.videos : []).filter(v => /^[\w-]{11}$/.test(v.id) && typeof v.title === 'string' && Number.isFinite(Date.parse(v.publishedAt)))
    .map(v => ({ id: v.id, title: v.title, publishedAt: v.publishedAt, image: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, url: `https://www.youtube.com/watch?v=${v.id}` }))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 5);
  if (!videos.length) throw new Error('Empty published feed');
  return { channelId: site.youtube.channelId, fetchedAt: data.fetchedAt, source: 'scheduled-feed', stale: Boolean(data.stale) || now - fetched > 2 * 60 * 60 * 1000, videos };
}

export async function fetchPublishedFeed() {
  if (cache && Date.now() - cache.time < TTL) return validatePublishedFeed(cache.data);
  const response = await fetch(URL, { signal: AbortSignal.timeout(4000), cache: 'no-cache' });
  if (!response.ok) throw new Error('Published feed unavailable');
  const data = validatePublishedFeed(await response.json());
  cache = { time: Date.now(), data };
  return data;
}

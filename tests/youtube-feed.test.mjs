import test from 'node:test';
import assert from 'node:assert/strict';
import { site } from '../src/data.js';
import { parsePlaylistItems, parseVideoFeed } from '../scripts/youtube-feed.mjs';

const item = (id, publishedAt = '2026-01-01T00:00:00Z', owner = site.youtube.channelId) => ({
  snippet: { title: `Video ${id}`, videoOwnerChannelId: owner }, contentDetails: { videoId: id, videoPublishedAt: publishedAt },
});

test('Data API excludes other channels, invalid dates and duplicates, then sorts newest first', () => {
  const videos = parsePlaylistItems({ items: [item('aaaaaaaaaaa'), item('bbbbbbbbbbb', '2026-02-01T00:00:00Z'), item('aaaaaaaaaaa'), item('ccccccccccc', 'invalid'), item('ddddddddddd', undefined, 'other-channel'), item('bad')] });
  assert.deepEqual(videos.map(v => v.id), ['bbbbbbbbbbb', 'aaaaaaaaaaa']);
});

test('Data API returns at most five public videos and rejects empty results', () => {
  assert.equal(parsePlaylistItems({ items: Array.from({ length: 8 }, (_, i) => item(String(i).repeat(11))) }).length, 5);
  assert.throws(() => parsePlaylistItems({ items: [] }));
  assert.throws(() => parsePlaylistItems({ items: [item('aaaaaaaaaaa', '2999-01-01T00:00:00Z')] }));
});

test('RSS parser rejects external entities', () => {
  assert.throws(() => parseVideoFeed('<!DOCTYPE feed><feed />'));
});

async function withFetch(key, fetcher, run) {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.YOUTUBE_API_KEY;
  if (key) process.env.YOUTUBE_API_KEY = key; else delete process.env.YOUTUBE_API_KEY;
  globalThis.fetch = fetcher;
  try { await run(); } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.YOUTUBE_API_KEY; else process.env.YOUTUBE_API_KEY = originalKey;
  }
}

test('configured API is preferred, cached and never includes a secret in the response', async () => {
  let calls = 0;
  await withFetch('test-server-only-key', async url => {
    calls++;
    assert.equal(new URL(url).hostname, 'www.googleapis.com');
    return { ok: true, json: async () => ({ items: [item('aaaaaaaaaaa')] }) };
  }, async () => {
    const { fetchVideoFeed } = await import(`../scripts/youtube-feed.mjs?api=${Date.now()}`);
    const first = await fetchVideoFeed();
    assert.equal(first.source, 'data-api');
    assert.equal(JSON.stringify(first).includes('test-server-only-key'), false);
    assert.deepEqual(await fetchVideoFeed(), first);
    assert.equal(calls, 1);
  });
});

test('API failure falls back to RSS rather than freezing the old snapshot', async () => {
  const xml = `<feed><entry><yt:videoId>bbbbbbbbbbb</yt:videoId><yt:channelId>${site.youtube.channelId}</yt:channelId><title>Latest &amp; official</title><published>2026-02-01T00:00:00Z</published></entry></feed>`;
  await withFetch('test-server-only-key', async url => new URL(url).hostname === 'www.googleapis.com'
    ? { ok: false, status: 403 } : { ok: true, text: async () => xml }, async () => {
    const { fetchVideoFeed } = await import(`../scripts/youtube-feed.mjs?fallback=${Date.now()}`);
    const result = await fetchVideoFeed();
    assert.equal(result.source, 'rss');
    assert.equal(result.videos[0].title, 'Latest & official');
  });
});

test('API handler marks the build snapshot stale and uncacheable on upstream failure', async () => {
  await withFetch(null, async () => { throw new Error('unavailable'); }, async () => {
    const { default: handler } = await import('../api/youtube.js');
    const headers = {};
    let body;
    await handler({ method: 'GET' }, { setHeader: (name, value) => { headers[name] = value; }, end: value => { body = JSON.parse(value); } });
    assert.equal(body.stale, true);
    assert.equal(headers['Cache-Control'], 'no-store');
    assert.equal(headers['Vercel-CDN-Cache-Control'], 'no-store');
    assert.ok(body.videos.length);
  });
});

test('scheduled feed verifies channel, rejects future timestamps and marks overdue refreshes stale', async () => {
  const { validatePublishedFeed } = await import('../scripts/published-youtube-feed.mjs');
  const now = Date.now();
  const feed = { channelId: site.youtube.channelId, fetchedAt: new Date(now).toISOString(), videos: [{ id: 'aaaaaaaaaaa', title: 'Latest', publishedAt: '2026-01-01T00:00:00Z', url: 'https://untrusted.example/' }] };
  assert.equal(validatePublishedFeed(feed, now).stale, false);
  assert.equal(validatePublishedFeed(feed, now).videos[0].url, 'https://www.youtube.com/watch?v=aaaaaaaaaaa');
  assert.equal(validatePublishedFeed(feed, now + 3 * 60 * 60 * 1000).stale, true);
  assert.throws(() => validatePublishedFeed({ ...feed, channelId: 'other' }, now));
  assert.throws(() => validatePublishedFeed({ ...feed, fetchedAt: new Date(now + 120000).toISOString() }, now));
});

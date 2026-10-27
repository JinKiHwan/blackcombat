import { fetchVideoFeed } from '../scripts/youtube-feed.mjs';
import snapshot from '../public/data/youtube.json' with { type: 'json' };

// Vercel Functions와 로컬 Vite가 같은 핸들러를 사용합니다.
export default async function youtube(request, response) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.statusCode = 405;
    response.end(JSON.stringify({ error: '지원하지 않는 요청입니다.' }));
    return;
  }

  try {
    const data = await fetchVideoFeed();
    // 메모리 캐시를 CDN에서 다시 10분 캐시하지 않도록 남은 유효 시간만 사용합니다.
    const age = Math.max(0, (Date.now() - Date.parse(data.fetchedAt)) / 1000);
    const remaining = Math.max(0, Math.floor(600 - age));
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Vercel-CDN-Cache-Control', `public, s-maxage=${remaining}`);
    response.end(JSON.stringify(data));
  } catch {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    if (snapshot.videos?.length) {
      response.end(JSON.stringify({ ...snapshot, stale: true }));
    } else {
      response.statusCode = 503;
      response.end(JSON.stringify({ error: '영상 목록을 불러오지 못했습니다.' }));
    }
  }
}

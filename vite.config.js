import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile } from 'node:fs/promises';
import { fetchVideoFeed } from './scripts/youtube-feed.mjs';

function youtubeFeed() {
  return {
    name: 'official-youtube-feed',
    configureServer(server) {
      server.middlewares.use('/api/youtube', async (request, response) => {
        if (request.method !== 'GET') { response.statusCode = 405; response.end(); return; }
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        try {
          response.end(JSON.stringify(await fetchVideoFeed()));
        } catch {
          try {
            const saved = JSON.parse(await readFile(new URL('./public/data/youtube.json', import.meta.url), 'utf8'));
            response.end(JSON.stringify({ ...saved, stale: true }));
          } catch {
            response.statusCode = 503;
            response.end(JSON.stringify({ error: '영상 목록을 불러오지 못했습니다.' }));
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), youtubeFeed()],
});

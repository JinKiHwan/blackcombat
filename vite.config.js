import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import youtube from './api/youtube.js';

function youtubeFeed() {
  function configure(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url?.split('?')[0] !== '/api/youtube') { next(); return; }
      youtube(request, response).catch(next);
    });
  }
  return {
    name: 'official-youtube-feed',
    configureServer: configure,
    configurePreviewServer: configure,
  };
}

export default defineConfig({
  plugins: [react(), youtubeFeed()],
});

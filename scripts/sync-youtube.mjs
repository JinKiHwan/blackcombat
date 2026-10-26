import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fetchVideoFeed } from './youtube-feed.mjs';

const directory = new URL('../public/data/', import.meta.url);
const snapshot = new URL('youtube.json', directory);
try {
  const data = await fetchVideoFeed();
  await mkdir(directory, { recursive: true });
  await writeFile(snapshot, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`YouTube: 최신 ${data.videos.length}개 갱신 (${data.fetchedAt})`);
} catch (error) {
  try {
    const previous = JSON.parse(await readFile(snapshot, 'utf8'));
    if (!previous.videos?.length) throw new Error('저장된 영상 없음');
    console.warn(`YouTube 갱신 실패: ${error.message}. 기존 목록 유지 (${previous.fetchedAt}).`);
  } catch {
    console.error(`YouTube 갱신 실패, 기존 목록도 없습니다: ${error.message}`);
    process.exitCode = 1;
  }
}

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

const datasetPath = 'data/imports/blackcombat-fighters.json';
const manifestPath = 'data/imports/blackcombat-fighter-images.json';
const directory = 'public/images/fighters';
const dataset = JSON.parse(await readFile(datasetPath, 'utf8'));
await mkdir(directory, { recursive: true });
let previous = [];
try { previous = JSON.parse(await readFile(manifestPath, 'utf8')).images; } catch (error) { if (error.code !== 'ENOENT') throw error; }
const images = [];

async function download(url) {
  const parsed = new URL(url);
  if (parsed.origin !== 'https://www.blackcombat-official.com') throw new Error('Unexpected source origin');
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      if (attempt) throw error;
      await delay(1500);
    }
  }
}

function extension(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'png';
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  throw new Error('Response is not a supported image');
}

for (const fighter of dataset.fighters) {
  if (!/^\d+$/.test(fighter.fighterId)) throw new Error('Invalid fighter ID');
  const saved = previous.find(row => row.fighterId === fighter.fighterId && row.status === 'downloaded');
  if (saved) {
    try {
      const expected = `/images/fighters/${fighter.fighterId}.`;
      if (!saved.localPath.startsWith(expected)) throw new Error('Invalid cached path');
      extension(await readFile(`public${saved.localPath}`));
      images.push(saved);
      continue;
    } catch { /* Re-download missing or invalid cached images. */ }
  }
  const row = { fighterId: fighter.fighterId, ringName: fighter.ringName, profileUrl: fighter.profileUrl, checkedAt: new Date().toISOString() };
  try {
    const html = await (await download(fighter.profileUrl)).text();
    const block = html.match(/<div\b[^>]*class=["'][^"']*\bfighter_img\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1];
    const src = block?.match(/<img\b[^>]*?\ssrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!src) throw new Error('fighter_img source missing');
    row.sourceUrl = new URL(src.replaceAll('&amp;', '&'), fighter.profileUrl).href;
    if (/blank|placeholder/i.test(new URL(row.sourceUrl).pathname)) {
      row.status = 'placeholder';
    } else {
      await delay(250);
      const bytes = Buffer.from(await (await download(row.sourceUrl)).arrayBuffer());
      const ext = extension(bytes);
      row.localPath = `/images/fighters/${fighter.fighterId}.${ext}`;
      await writeFile(`public${row.localPath}`, bytes);
      row.bytes = bytes.length;
      row.status = 'downloaded';
    }
  } catch (error) {
    row.status = 'failed';
    row.error = error.message;
  }
  images.push(row);
  await writeFile(manifestPath, JSON.stringify({ collectedAt: new Date().toISOString(), selector: '.fighter_img img', images }, null, 2) + '\n');
  console.log(`${images.length}/${dataset.fighters.length} ${row.fighterId} ${row.status}`);
  await delay(300);
}

for (const fighter of dataset.fighters) {
  const row = images.find(image => image.fighterId === fighter.fighterId);
  fighter.profileImage = { status: row.status, sourceUrl: row.sourceUrl ?? null, localPath: row.localPath ?? null };
}
await writeFile(datasetPath, JSON.stringify(dataset, null, 2) + '\n');
console.log(JSON.stringify(images.reduce((counts, row) => ({ ...counts, [row.status]: (counts[row.status] || 0) + 1 }), {})));

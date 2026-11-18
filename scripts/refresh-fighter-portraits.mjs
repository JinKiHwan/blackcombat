import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

const paths = ['blackcombat-fighters', 'blackcombat-fighter-images', 'blackcombat-event-portraits', 'numbering17-profiles'];
const [roster, manifest, events, numbering] = await Promise.all(paths.map(async name => JSON.parse(await readFile(`data/imports/${name}.json`, 'utf8'))));
// Limit a normal refresh to the upcoming card; explicit IDs can narrow the work further.
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(numbering.profiles);
if (ids.some(id => !/^\d+$/.test(id))) throw Error('Invalid fighter ID');
const updates = [], failures = [], missing = [];
async function request(url) {
  if (new URL(url).origin !== 'https://www.blackcombat-official.com') throw Error('Unexpected image origin');
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw Error(`HTTP ${response.status}`);
  return response;
}
async function refresh(id) {
  const profileUrl = `https://www.blackcombat-official.com/fighter/${id}`;
  const html = await (await request(profileUrl)).text();
  const block = html.match(/<div\b[^>]*class=["'][^"']*\bfighter_img\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1];
  const src = block?.match(/<img\b[^>]*?\ssrc\s*=\s*["']([^"']+)["']/i)?.[1];
  if (!src) throw Error('Missing fighter_img');
  const sourceUrl = new URL(src.replaceAll('&amp;', '&'), profileUrl).href;
  if (/blank|placeholder/i.test(new URL(sourceUrl).pathname)) { missing.push(id); return; }
  const fighter = roster.fighters.find(f => f.fighterId === id);
  const previous = numbering.profiles[id]?.imageSource || events.profiles[id]?.sourceUrl || fighter?.profileImage?.sourceUrl;
  if (sourceUrl === previous) return;
  const bytes = Buffer.from(await (await request(sourceUrl)).arrayBuffer());
  const ext = bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' ? 'webp' : bytes[0] === 137 && bytes[1] === 80 ? 'png' : bytes[0] === 255 && bytes[1] === 216 ? 'jpg' : null;
  if (!ext) throw Error('Invalid image bytes');
  const localPath = `/images/fighters/${id}.${ext}`;
  await writeFile(`public${localPath}`, bytes);
  const checkedAt = new Date().toISOString();
  const image = { status: 'downloaded', sourceUrl, localPath };
  if (fighter) fighter.profileImage = image;
  const entry = manifest.images.find(row => row.fighterId === id);
  if (entry) Object.assign(entry, image, { checkedAt, bytes: bytes.length });
  for (const profile of [events.profiles[id], numbering.profiles[id]]) {
    if (!profile) continue;
    delete profile.imageKind;
    delete profile.imageProvenance;
  }
  if (events.profiles[id]) Object.assign(events.profiles[id], image, { checkedAt });
  if (numbering.profiles[id]) Object.assign(numbering.profiles[id], { image: localPath, imageSource: sourceUrl, collectedAt: checkedAt });
  updates.push({ id, name: fighter?.ringName, sourceUrl, localPath });
  console.log(`Updated ${id} ${fighter?.ringName || ''}`);
}
for (const id of ids) {
  try { await refresh(id); } catch (error) {
    failures.push({ id, error: error.message });
    // Do not continue sending requests when the origin is overloaded or rate limiting.
    if (/HTTP (429|503)/.test(error.message)) break;
  }
  await delay(1000);
}
for (const [index, data] of [roster, manifest, events, numbering].entries()) await writeFile(`data/imports/${paths[index]}.json`, JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify({ checked: ids.length, updates, missing, failures }, null, 2));

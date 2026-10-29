// uploads 재생목록을 사용해 search.list의 반복 호출을 피합니다.
export async function getLatestVideos({ apiKey, uploadsPlaylistId }, signal) {
  if (!apiKey || !uploadsPlaylistId) return [];
  const params = new URLSearchParams({ part: 'snippet', playlistId: uploadsPlaylistId, maxResults: '5', key: apiKey });
  const timeout = AbortSignal.timeout(8000);
  const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`, { signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
  if (!response.ok) throw new Error('유튜브 영상을 불러오지 못했습니다. 잠시 후 다시 확인해주세요.');
  const data = await response.json();
  return (data.items ?? []).filter(item => /^[\w-]{11}$/.test(item.snippet?.resourceId?.videoId)).map(({ snippet }) => ({
    id: snippet.resourceId.videoId,
    publishedAt: snippet.publishedAt,
    title: snippet.title,
    category: 'YOUTUBE · LATEST UPLOAD',
    image: `https://i.ytimg.com/vi/${snippet.resourceId.videoId}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`,
  })).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 5);
}

export async function getOfficialVideos(signal) {
  const response = await fetch('/api/youtube', {
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000),
    cache: 'no-cache',
  });
  if (!response.ok) throw new Error('영상 목록을 불러오지 못했습니다.');
  const data = await response.json();
  const videos = (Array.isArray(data.videos) ? data.videos : [])
    .filter(video => /^[\w-]{11}$/.test(video.id) && typeof video.title === 'string' && Number.isFinite(Date.parse(video.publishedAt)))
    .map(video => ({ ...video, url: `https://www.youtube.com/watch?v=${video.id}`, image: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg` }))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 5);
  if (!videos.length) throw new Error('표시할 영상이 없습니다.');
  return { videos, fetchedAt: data.fetchedAt, stale: Boolean(data.stale) };
}

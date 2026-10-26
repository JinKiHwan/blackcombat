import { useEffect, useState } from 'react';
import { site } from '../data.js';
import { getLatestVideos, getOfficialVideos } from '../youtube.js';
import './media.css';

function MediaCard({ video, featured }) {
  return (
    <a className="legacy-card" href={video.url} target="_blank" rel="noopener noreferrer" aria-label={`${video.title} · YouTube 새 탭에서 보기`}>
      <div className="legacy-thumbnail"><img src={featured ? `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg` : video.image} onError={event => { if (event.currentTarget.src !== video.image) event.currentTarget.src = video.image; }} alt="" width="480" height="270" loading="lazy" /></div>
      <h3>{video.title}</h3>
      <time className="legacy-date" dateTime={video.publishedAt}>{new Date(video.publishedAt).toLocaleDateString('ko-KR')}</time>
    </a>
  );
}

export default function MediaSection() {
  const [state, setState] = useState({ videos: [], loading: true, error: false, stale: false });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const data = site.youtube.apiKey
          ? { videos: await getLatestVideos(site.youtube, controller.signal) }
          : await getOfficialVideos(controller.signal);
        if (controller.signal.aborted) return;
        setState({ ...data, loading: false, error: false });
      } catch {
        if (!controller.signal.aborted) setState({ videos: [], loading: false, error: true });
      }
    }
    load();
    // 열린 화면도 주기적으로 확인합니다. 정적 배포에서는 배포된 스냅샷을 읽습니다.
    const timer = window.setInterval(load, 10 * 60 * 1000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, []);

  return (
    <section id="media" className="legacy-section container" aria-labelledby="legacy-title" aria-busy={state.loading}>
      <div className="legacy-heading"><h2 id="legacy-title" className="section-title">MEDIA &amp; LEGACY</h2></div>
      {state.loading ? <div className="legacy-grid" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <div className="legacy-card" key={index}><div className="legacy-skeleton" /></div>)}</div> :
        state.videos.length ? <div className="legacy-grid">{state.videos.map((video, index) => <MediaCard key={video.id} video={video} featured={index === 0} />)}</div> :
          <div className="legacy-empty"><p>영상을 불러오지 못했습니다. 공식 채널에서 최신 영상을 확인해주세요.</p><a className="legacy-channel" href={site.youtube.channelUrl} target="_blank" rel="noopener noreferrer">블랙컴뱃 공식 채널 ↗</a></div>}
      <p className="legacy-notice" role="status">{state.loading ? '최신 영상을 불러오는 중입니다.' : state.stale ? '업데이트가 지연되어 최근 저장된 영상을 표시합니다.' : ''}</p>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import './store.css';

export default function StoreSection() {
  const videoRef = useRef(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let disposed = false;
    video.muted = true;
    async function updatePlayback() {
      if (!visible || document.hidden || motion.matches) { video.pause(); return; }
      try {
        await video.play();
        if (!disposed) setBlocked(false);
      } catch {
        if (!disposed && visible && !document.hidden) setBlocked(true);
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.05 });
    observer.observe(video);
    document.addEventListener('visibilitychange', updatePlayback);
    motion.addEventListener('change', updatePlayback);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', updatePlayback);
      motion.removeEventListener('change', updatePlayback);
      video.pause();
    };
  }, []);

  async function playBackground() {
    try { await videoRef.current.play(); setBlocked(false); } catch { setBlocked(true); }
  }

  return (
    <section id="store" className="store-section" aria-labelledby="store-title">
      <video ref={videoRef} className="store-video" src="https://player-api.charlla.io/mp4/lx8mgdfzm83" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
      <div className="store-shade" aria-hidden="true" />
      <div className="store-content container">
        <h2 id="store-title" className="section-title">BLACKCOMBAT STORE</h2>
        <a className="store-link" href="https://blackcombatstore.com/" target="_blank" rel="noopener noreferrer" aria-label="스토어 바로가기 · 새 탭에서 열기">스토어 바로가기</a>
      </div>
      {blocked && <button className="store-play" type="button" onClick={playBackground}>배경 영상 재생 ▶</button>}
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { loadYouTubePlayer } from '../utils/youtubePlayer.js';
import './header-music.css';

export default function HeaderMusic() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [minimized, setMinimized] = useState(false);
  const minimizedRef = useRef(false);
  const [volume, setVolume] = useState(35);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const mount = useRef(null);
  const player = useRef(null);
  const wanted = useRef(false);
  const ready = useRef(false);

  useEffect(() => {
    function startMusic() {
      wanted.current = true;
      setOpened(true);
      if (ready.current && !document.hidden) player.current?.playVideo();
    }
    document.addEventListener('bc:music-play', startMusic);
    return () => document.removeEventListener('bc:music-play', startMusic);
  }, []);

  useEffect(() => {
    if (!opened) return;
    let cancelled = false;
    const holder = document.createElement('div');
    mount.current.append(holder);
    setMessage('영상을 연결하고 있습니다.');
    loadYouTubePlayer().then(YT => {
      if (cancelled) return;
      player.current = new YT.Player(holder, {
        width: '100%', height: '200', videoId: 'eqESjvnkgJQ',
        playerVars: { autoplay: 0, playsinline: 1, controls: 1, origin: window.location.origin, loop: 1, playlist: 'eqESjvnkgJQ' },
        events: {
          onReady: event => {
            if (cancelled) return;
            ready.current = true;
            event.target.setVolume(35);
            setMessage('재생되지 않으면 영상의 재생 버튼을 눌러주세요.');
            if (wanted.current && !document.hidden) event.target.playVideo();
          },
          onStateChange: event => {
            if (cancelled) return;
            setPlaying(event.data === 1);
            if (event.data === 1) { if (document.hidden) { player.current?.pauseVideo(); return; } wanted.current = true; setMessage('VantaBlack official trailer'); }
            if (event.data === 2 || event.data === 0) wanted.current = false;
          },
          onAutoplayBlocked: () => { if (!cancelled) { wanted.current = false; setPlaying(false); setMessage('영상의 재생 버튼을 눌러 시작해주세요.'); } },
          onError: () => { if (!cancelled) { wanted.current = false; setPlaying(false); setMessage('영상을 재생하지 못했습니다. YouTube에서 확인해주세요.'); } },
        },
      });
    }).catch(error => { if (!cancelled) setMessage(error.message); });
    function onVisibility() {
      if (document.hidden) { wanted.current = false; if (ready.current) player.current?.pauseVideo(); setPlaying(false); }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true; ready.current = false;
      document.removeEventListener('visibilitychange', onVisibility);
      player.current?.destroy(); player.current = null; holder.remove();
    };
  }, [opened]);

  useEffect(() => {
    if (!opened || minimized) return;
    const timer = setInterval(() => {
      if (ready.current) setProgress({ current: player.current?.getCurrentTime?.() || 0, duration: player.current?.getDuration?.() || 0 });
    }, 500);
    return () => clearInterval(timer);
  }, [opened, minimized]);
  function expand() { minimizedRef.current = false; setMinimized(false); }
  function minimize() {
    minimizedRef.current = true; setMinimized(true);
  }
  const time = seconds => Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
  function toggle() {
    if (minimizedRef.current) expand();
    if (!opened) { wanted.current = true; setOpened(true); return; }
    wanted.current = !wanted.current;
    if (ready.current) {
      if (wanted.current) player.current.playVideo(); else player.current.pauseVideo();
    }
  }
  function close() { wanted.current = false; setOpened(false); setPlaying(false); expand(); setProgress({ current: 0, duration: 0 }); }
  return <>
    <button type="button" className="header-music-button" onClick={toggle} aria-label={playing ? '배경음악 일시정지' : '배경음악 재생'} aria-pressed={playing} aria-controls={opened ? 'header-music-player' : undefined} title={playing ? '배경음악 일시정지' : '배경음악 재생'}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">{playing ? <path d="M7 5h4v14H7zm6 0h4v14h-4z" /> : <path d="M8 4.5v15l12-7.5z" />}</svg>
    </button>
    {opened && <aside id="header-music-player" className={'header-music-panel' + (minimized ? ' is-minimized' : '')} aria-label="BLACK COMBAT 음악 플레이어">
      <div className="music-deck">
        <img className="music-cover" src="/images/common/swiper-pagination.webp" alt="" />
        <div className="music-track-info"><span>BLACK COMBAT · SOUND</span><strong>VantaBlack</strong><small>Official trailer</small></div>
        <div className="music-window-controls"><button type="button" onClick={minimized ? expand : minimize} aria-label={minimized ? '플레이어 펼치기' : '플레이어 최소화'} title={minimized ? '펼치기' : '최소화'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={minimized ? 'M6 15l6-6 6 6' : 'M6 12h12'} /></svg></button><button type="button" onClick={close} aria-label="배경음악 끄고 플레이어 닫기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button></div>
      </div>
      <div className="header-music-video" ref={mount} />
      <div className="music-controls"><button className="music-restart" type="button" aria-label="처음부터 재생" onClick={() => { if (ready.current) player.current.seekTo(0, true); }}>↤</button><button type="button" className="music-toggle" onClick={toggle} aria-label={playing ? '음악 일시정지' : '음악 재생'}><svg viewBox="0 0 24 24" aria-hidden="true">{playing ? <path d="M7 5h4v14H7zm6 0h4v14h-4z" /> : <path d="M8 4.5v15l12-7.5z" />}</svg></button><span className="music-time">{time(progress.current)} / {time(progress.duration)}</span>{!minimized && <label className="music-volume"><span>볼륨</span><input type="range" min="0" max="100" value={volume} aria-label="음악 볼륨" onChange={event => { const value = Number(event.target.value); setVolume(value); if (ready.current) player.current.setVolume(value); }} /></label>}</div>
      {!minimized && <><input className="music-progress" type="range" aria-label="재생 위치" min="0" max={progress.duration || 1} step="0.1" value={Math.min(progress.current, progress.duration || 1)} disabled={!progress.duration} onChange={event => { const value = Number(event.target.value); player.current?.seekTo(value, true); setProgress(current => ({ ...current, current: value })); }} /><div className="header-music-caption"><p role="status">{message}</p><a href="https://www.youtube.com/watch?v=eqESjvnkgJQ" target="_blank" rel="noopener noreferrer">YouTube ↗</a></div></>}
    </aside>}
  </>;
}

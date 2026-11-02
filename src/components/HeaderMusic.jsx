import { useEffect, useRef, useState } from 'react';
import { loadYouTubePlayer } from '../utils/youtubePlayer.js';
import './header-music.css';

export default function HeaderMusic() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const mount = useRef(null);
  const player = useRef(null);
  const wanted = useRef(false);
  const ready = useRef(false);

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
            if (event.data === 1) { wanted.current = true; setMessage('VantaBlack official trailer'); }
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

  function toggle() {
    if (!opened) { wanted.current = true; setOpened(true); return; }
    wanted.current = !wanted.current;
    if (ready.current) {
      if (wanted.current) player.current.playVideo(); else player.current.pauseVideo();
    }
  }
  function close() { wanted.current = false; setOpened(false); setPlaying(false); }
  return <>
    <button type="button" className="header-music-button" onClick={toggle} aria-label={playing ? '배경음악 일시정지' : '배경음악 재생'} aria-pressed={playing} aria-controls={opened ? 'header-music-player' : undefined} title={playing ? '배경음악 일시정지' : '배경음악 재생'}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">{playing ? <path d="M7 5h4v14H7zm6 0h4v14h-4z" /> : <path d="M8 4.5v15l12-7.5z" />}</svg>
    </button>
    {opened && <aside id="header-music-player" className="header-music-panel" aria-label="배경음악 YouTube 플레이어">
      <div className="header-music-top"><span>BLACK COMBAT · SOUND</span><button type="button" onClick={close} aria-label="배경음악 끄고 플레이어 닫기">×</button></div>
      <div className="header-music-video" ref={mount} />
      <div className="header-music-caption"><p role="status">{message}</p><a href="https://www.youtube.com/watch?v=eqESjvnkgJQ" target="_blank" rel="noopener noreferrer">YouTube ↗</a></div>
    </aside>}
  </>;
}

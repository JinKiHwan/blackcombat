import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import './fanmade-notice.css';

const STORAGE_KEY = 'blackcombat-fanmade-notice-v1';

export default forwardRef(function FanmadeNotice(_, ref) {
  const dialog = useRef(null);
  useImperativeHandle(ref, () => ({ open() { if (!dialog.current.open) dialog.current.showModal(); } }), []);
  useEffect(() => {
    let acknowledged = false;
    try { acknowledged = localStorage.getItem(STORAGE_KEY) === 'acknowledged'; } catch { /* Show the notice when storage is unavailable. */ }
    if (!acknowledged && !dialog.current.open) dialog.current.showModal();
  }, []);
  function acknowledge(startMusic = false) {
    try { localStorage.setItem(STORAGE_KEY, 'acknowledged'); } catch { /* The notice can still be closed without storage. */ }
    dialog.current.close();
    if (startMusic) document.dispatchEvent(new CustomEvent('bc:music-play'));
  }
  return <dialog ref={dialog} className="fanmade-notice" aria-labelledby="fanmade-title" aria-describedby="fanmade-description" data-lenis-prevent onCancel={event => { event.preventDefault(); acknowledge(); }}>
    <div className="fanmade-notice-content">
      <p className="fanmade-notice-kicker">UNOFFICIAL · FAN-MADE PROJECT</p>
      <h2 id="fanmade-title">팬메이드 사이트 안내</h2>
      <p id="fanmade-description">이 사이트는 <strong>블랙컴뱃 공식 홈페이지가 아닙니다.</strong><br />블랙컴뱃 팬이 제작한 비공식 리뉴얼 프로젝트입니다.</p>
      <p className="fanmade-notice-detail">대회 일정·티켓 예매 등 정확한 공식 안내는 블랙컴뱃 공식 홈페이지에서 확인해주세요.</p>
      <div className="fanmade-notice-actions"><a href="https://www.blackcombat-official.com/" target="_blank" rel="noopener noreferrer">공식 홈페이지 ↗</a><button type="button" onClick={() => acknowledge(true)} autoFocus>확인하고 둘러보기</button></div>
      <p className="fanmade-notice-footnote">확인 후에는 이 브라우저에서 다시 표시하지 않습니다.</p>
    </div>
  </dialog>;
});

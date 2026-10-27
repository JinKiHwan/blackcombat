import { useEffect, useState } from 'react';
import './header.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 24); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
      <a className="header-logo" href="/" aria-label="블랙컴뱃 홈"><img src="/images/common/logo.png" alt="BLACK COMBAT" width="178" height="44" /></a>
      <nav id="navigation" className={`menu-panel${open ? ' open' : ''}`} aria-label="주 메뉴" aria-hidden={!open} inert={!open}>
        {[
          ['/events', 'EVENTS'], ['/ranking', 'RANKING'],
          ['media', 'MEDIA'], ['gym', 'GYM'],
        ].map(([id, label], index) => <a key={id} style={{ '--menu-order': index }} href={id.startsWith('/') ? id : `/#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
        <div className="menu-social" role="group" aria-label="블랙컴뱃 공식 소셜 채널">
          <a href="https://www.youtube.com/@blackcombat" target="_blank" rel="noopener noreferrer" aria-label="블랙컴뱃 공식 YouTube · 새 탭에서 열기" style={{ '--menu-order': 4 }}><img src="/images/common/social-youtube.svg" alt="" width="28" height="28" /></a>
          <a href="https://www.instagram.com/blackcombat_official/" target="_blank" rel="noopener noreferrer" aria-label="블랙컴뱃 공식 Instagram · 새 탭에서 열기" style={{ '--menu-order': 5 }}><img src="/images/common/social-instagram.svg" alt="" width="26" height="26" /></a>
        </div>
      </nav>
      <button className="menu-button" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(value => !value)}>
        <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
      </button>
    </header>
  );
}

import { useEffect, useState } from 'react';

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
      <a className="header-logo" href="#" aria-label="블랙컴뱃 홈"><img src="/images/common/logo.png" alt="BLACK COMBAT" width="178" height="44" /></a>
      <nav id="navigation" className={open ? 'open' : ''} aria-label="주 메뉴">
        {[
          ['fight-card', 'FIGHT CARD'], ['champions', 'CHAMPIONS'],
          ['media', 'MEDIA'], ['gym', 'GYM'],
        ].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <button className="menu-button" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(value => !value)}>
        <span /><span />
      </button>
    </header>
  );
}

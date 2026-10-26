import { useEffect } from 'react';
import './page-transition.css';

export function usePageTransition() {
  useEffect(() => {
    const root = document.getElementById('root');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer;
    let navigating = false;

    function reset() {
      clearTimeout(timer);
      navigating = false;
      root.classList.remove('page-leaving');
    }

    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const next = new URL(anchor.href, window.location.href);
      if (next.origin !== window.location.origin || !['http:', 'https:'].includes(next.protocol)) return;
      // Section anchors keep their existing smooth scroll behavior.
      if (next.pathname === window.location.pathname && next.search === window.location.search) return;
      if (motion.matches) return;
      event.preventDefault();
      if (navigating) return;
      navigating = true;
      root.classList.add('page-leaving');
      timer = window.setTimeout(() => window.location.assign(next.href), 280);
    }

    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', reset);
    return () => {
      clearTimeout(timer);
      root.classList.remove('page-leaving');
      document.removeEventListener('click', onClick);
      window.removeEventListener('pageshow', reset);
    };
  }, []);
}

import { useEffect, useLayoutEffect, useState } from 'react';
import './page-transition.css';

export function usePageTransition() {
  const [locationKey, setLocationKey] = useState(() => location.pathname + location.search + location.hash);
  useEffect(() => {
    let timer;
    let navigating = false;
    function commit(url, push) {
      clearTimeout(timer);
      navigating = false;
      if (push) history.pushState(null, '', url);
      setLocationKey(location.pathname + location.search + location.hash);
      document.getElementById('main')?.classList.remove('page-leaving');
    }
    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const next = new URL(anchor.href, location.href);
      if (next.origin !== location.origin || !/^\/(?:index(?:\.html)?|events(?:\/\d+)?|numbering\/\d+|ranking|rules|doping|awards)?\/?$/.test(next.pathname)) return;
      if (next.pathname === location.pathname && next.search === location.search) return;
      event.preventDefault();
      if (navigating) return;
      navigating = true;
      const main = document.getElementById('main');
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) commit(next.href, true);
      else {
        main?.classList.add('page-leaving');
        timer = setTimeout(() => commit(next.href, true), 280);
      }
    }
    const onPop = () => commit(location.href, false);
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    return () => { clearTimeout(timer); document.removeEventListener('click', onClick); window.removeEventListener('popstate', onPop); };
  }, []);
  useLayoutEffect(() => {
    const main = document.getElementById('main');
    main?.classList.remove('page-leaving');
    const animation = !matchMedia('(prefers-reduced-motion: reduce)').matches && main?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' });
    const frame = requestAnimationFrame(() => {
      document.dispatchEvent(new CustomEvent('bc:navigate', { detail: { hash: location.hash } }));
      const heading = main?.querySelector('h1');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
    });
    return () => { cancelAnimationFrame(frame); animation?.cancel?.(); };
  }, [locationKey]);
  return locationKey.split(/[?#]/)[0];
}

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function useSmoothScroll() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis;

    function setup() {
      lenis?.destroy();
      lenis = undefined;
      if (motion.matches) return;
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -100 },
        prevent: node => node.classList?.contains('comments'),
      });
    }

    setup();
    function onNavigate(event) {
      let target = 0;
      try { target = event.detail.hash ? document.getElementById(decodeURIComponent(event.detail.hash.slice(1))) || 0 : 0; } catch { /* Invalid hash falls back to the top. */ }
      if (lenis) { lenis.resize(); lenis.scrollTo(target, { immediate: true, force: true, offset: target ? -100 : 0 }); }
      else if (target) target.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
    document.addEventListener('bc:navigate', onNavigate);
    motion.addEventListener('change', setup);
    return () => {
      document.removeEventListener('bc:navigate', onNavigate);
      motion.removeEventListener('change', setup);
      lenis?.destroy();
    };
  }, []);
}

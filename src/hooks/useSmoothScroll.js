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
    motion.addEventListener('change', setup);
    return () => {
      motion.removeEventListener('change', setup);
      lenis?.destroy();
    };
  }, []);
}

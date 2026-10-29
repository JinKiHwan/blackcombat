import { useEffect } from 'react';
import './home-scroll-reveal.css';

const targets = [
  ['#branding .section-title', 0], ['.branding-subtitle', 90], ['.branding-description', 180],
  ['.champ-heading', 0], ['.champ-tile', 'stagger'], ['.champ-rankings', 120],
  ['.legacy-heading', 0], ['.legacy-grid', 100], ['.store-content', 0],
  ['.gym-heading', 0], ['.gym-location-tabs', 80], ['.gym-gallery', 160],
];

export function useHomeScrollReveal(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    const elements = [];
    function reset() {
      observer?.disconnect();
      elements.forEach(element => {
        element.classList.remove('home-reveal', 'is-revealed');
        element.style.removeProperty('--reveal-delay');
      });
      elements.length = 0;
    }
    function setup() {
      reset();
      if (motion.matches || !('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });
      for (const [selector, delay] of targets) {
        document.querySelectorAll(`#main ${selector}`).forEach((element, index) => {
          // 복원된 스크롤 위치 위쪽 콘텐츠는 숨기지 않습니다.
          if (element.getBoundingClientRect().top < innerHeight - 40) return;
          elements.push(element);
          element.style.setProperty('--reveal-delay', `${delay === 'stagger' ? index % 4 * 70 : delay}ms`);
          element.classList.add('home-reveal');
          observer.observe(element);
        });
      }
    }
    setup();
    motion.addEventListener('change', setup);
    return () => { reset(); motion.removeEventListener('change', setup); };
  }, [enabled]);
}

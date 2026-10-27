import { useEffect, useRef, useState } from 'react';

const easeOut = value => 1 - (1 - value) ** 3;

export default function AnimatedPrediction({ left, names = [], selected, onVote }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState({ progress: 0, balance: 0 });

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let started = false;
    let visible = false;
    const finish = () => setDisplay({ progress: 1, balance: left });

    function start() {
      if (motion.matches) { cancelAnimationFrame(frame); finish(); return; }
      if (started || !visible) return;
      started = true;
      let beginning;
      function tick(now) {
        beginning ??= now;
        const progress = Math.min((now - beginning) / 1700, 1);
        const eased = easeOut(progress);
        setDisplay({ progress: eased, balance: left * eased });
        if (progress < 1) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    }, { threshold: 0.6 });
    observer.observe(ref.current);
    motion.addEventListener('change', start);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', start);
      cancelAnimationFrame(frame);
    };
  }, [left]);

  return (
    <div ref={ref} className="numbering-prediction-display">
      <div className="numbering-prediction" role="img" aria-label={`응원 비율 예시 ${left}% 대 ${100 - left}%`}><span style={{ width: `calc(${display.balance}% + ${12 * Math.sin(Math.PI * display.balance / 100)}px)`, '--gauge-cut': `${24 * Math.sin(Math.PI * display.balance / 100)}px` }} /></div>
      <div className="numbering-percent">{[left, 100 - left].map((percent, index) => <span key={index} className="numbering-percent-side"><span aria-hidden="true">{Math.round(percent * display.progress)}%</span>{onVote && <button type="button" className="numbering-vote-icon" disabled={selected !== undefined} aria-label={`${names[index]} 선수 응원${selected === index ? ' 완료' : ''}`} aria-pressed={selected === index} onClick={() => onVote(index)}><img src="/images/common/btn-up.png" alt="" width="20" height="20" /></button>}</span>)}</div>
    </div>
  );
}

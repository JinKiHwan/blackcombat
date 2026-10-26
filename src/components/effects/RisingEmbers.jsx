import { useEffect, useRef } from 'react';
import './embers.css';

export default function RisingEmbers() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previous = 0;
    let width = 0;
    let height = 0;
    let top = 0;
    let bottom = 0;
    let particles = [];

    function measure() {
      width = window.innerWidth;
      height = window.innerHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const scroll = window.scrollY;
      top = (document.querySelector('.main-visual')?.getBoundingClientRect().bottom ?? 0) + scroll;
      bottom = document.querySelector('.footer')?.getBoundingClientRect().bottom + scroll || document.documentElement.scrollHeight;
      const count = Math.min(240, Math.round((bottom - top) * width / 48000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: top + Math.random() * (bottom - top),
        speed: 30 + Math.random() * 55,
        radius: .6 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        sway: 8 + Math.random() * 24,
        alpha: .3 + Math.random() * .45,
      }));
    }

    function render(now) {
      frame = requestAnimationFrame(render);
      if (now - previous < 1000 / 30) return;
      const dt = previous ? Math.min((now - previous) / 1000, .08) : 0;
      previous = now;
      context.clearRect(0, 0, width, height);
      const scroll = window.scrollY;
      const visibleTop = Math.max(0, top - scroll);
      if (visibleTop >= height) return;
      context.save();
      context.beginPath();
      context.rect(0, visibleTop, width, Math.max(0, Math.min(height, bottom - scroll) - visibleTop));
      context.clip();
      context.globalCompositeOperation = 'lighter';
      for (const particle of particles) {
        particle.y -= particle.speed * dt;
        if (particle.y < top) particle.y = bottom;
        const y = particle.y - scroll;
        if (y < -10 || y > height + 10) continue;
        const x = particle.x + Math.sin(now * .0006 + particle.phase) * particle.sway;
        const fade = Math.min(1, (particle.y - top) / 180, (bottom - particle.y) / 80);
        context.globalAlpha = particle.alpha * fade * (.8 + .2 * Math.sin(now * .003 + particle.phase));
        context.save();
        context.translate(x, y);
        context.rotate(.12 + Math.sin(now * .0008 + particle.phase) * .22);
        context.scale(particle.radius, particle.radius);
        const glow = context.createRadialGradient(0, 0, 0, 0, 0, 5);
        glow.addColorStop(0, '#ffac78');
        glow.addColorStop(.35, '#ed3a24');
        glow.addColorStop(1, '#b7101000');
        context.fillStyle = glow;
        context.beginPath();
        context.moveTo(0, -5);
        context.bezierCurveTo(1.1, -2.7, 1.9, 1.7, 0, 5);
        context.bezierCurveTo(-1.9, 2, -1.3, -1.7, 0, -5);
        context.closePath();
        context.fill();
        context.restore();
      }
      context.restore();
    }

    function syncMotion() {
      cancelAnimationFrame(frame);
      previous = 0;
      context.clearRect(0, 0, width, height);
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(render);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(document.getElementById('root'));
    window.addEventListener('resize', measure);
    motion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncMotion);
    measure();
    syncMotion();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
      motion.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncMotion);
    };
  }, []);

  return <canvas ref={canvasRef} className="rising-embers" aria-hidden="true" />;
}

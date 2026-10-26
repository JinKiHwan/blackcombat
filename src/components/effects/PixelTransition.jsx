import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const PixelTransition = forwardRef(function PixelTransition(_, ref) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);
  useImperativeHandle(ref, () => ({
    play(image, direction = 1) {
      cancelAnimationFrame(frameRef.current);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      if (!image?.complete || !image.naturalWidth || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      // Match the slide's contain sizing, including images with a slightly different ratio.
      const fit = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const dw = image.naturalWidth * fit;
      const dh = image.naturalHeight * fit;
      const ox = (width - dw) / 2;
      const oy = (height - dh) / 2;
      // Voronoi fragments share boundaries, so the intact image has no gaps.
      const count = width < 680 ? 55 : 110;
      const seeds = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height }));
      const tiles = seeds.map(seed => {
        let polygon = [[0, 0], [width, 0], [width, height], [0, height]];
        for (const other of seeds) {
          if (other === seed || !polygon.length) continue;
          const nx = other.x - seed.x;
          const ny = other.y - seed.y;
          const limit = (other.x ** 2 + other.y ** 2 - seed.x ** 2 - seed.y ** 2) / 2;
          const clipped = [];
          for (let i = 0; i < polygon.length; i++) {
            const a = polygon[i];
            const b = polygon[(i + 1) % polygon.length];
            const da = a[0] * nx + a[1] * ny - limit;
            const db = b[0] * nx + b[1] * ny - limit;
            if (da <= 0) clipped.push(a);
            if ((da <= 0) !== (db <= 0)) {
              const t = da / (da - db);
              clipped.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
            }
          }
          polygon = clipped;
        }
        // Give each shared edge matching jagged contours, like torn paper.
        const torn = [];
        for (let i = 0; i < polygon.length; i++) {
          const a = polygon[i];
          const b = polygon[(i + 1) % polygon.length];
          torn.push(a);
          const forward = a[0] < b[0] || (Math.abs(a[0] - b[0]) < .001 && a[1] < b[1]);
          const start = forward ? a : b;
          const end = forward ? b : a;
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const length = Math.hypot(dx, dy);
          const points = [.25, .5, .75].map((t, j) => {
            const noise = Math.sin(Math.round(start[0]) * 12.9898 + Math.round(start[1]) * 78.233 + Math.round(end[0]) * 3.17 + j * 37.1);
            const offset = noise * Math.min(7, length * .09);
            return [start[0] + dx * t - dy / length * offset, start[1] + dy * t + dx / length * offset];
          });
          torn.push(...(forward ? points : points.reverse()));
        }
        return { x: seed.x, y: seed.y, polygon: torn,
          delay: (direction > 0 ? seed.x / width : 1 - seed.x / width) * .3 + Math.random() * .18,
          dx: direction * (35 + Math.random() * 100),
          dy: (Math.random() - .5) * 130,
          spin: (Math.random() - .5) * .45 };
      });
      const started = performance.now();
      function draw(now) {
        const elapsed = (now - started) / 1000;
        ctx.clearRect(0, 0, width, height);
        for (const tile of tiles) {
          const p = Math.max(0, Math.min(1, (elapsed - tile.delay) / .56));
          if (p === 1) continue;
          ctx.save();
          ctx.globalAlpha = 1 - p * p;
          ctx.translate(tile.x + tile.dx * p * p, tile.y + tile.dy * p * p);
          ctx.rotate(tile.spin * p);
          const shrink = 1 - p * .25;
          ctx.scale(shrink, shrink);
          ctx.beginPath();
          tile.polygon.forEach(([x, y], index) => {
            if (index === 0) ctx.moveTo(x - tile.x, y - tile.y);
            else ctx.lineTo(x - tile.x, y - tile.y);
          });
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(image, ox - tile.x, oy - tile.y, dw, dh);
          ctx.restore();
        }
        if (elapsed < 1.05) frameRef.current = requestAnimationFrame(draw);
        else ctx.clearRect(0, 0, width, height);
      }
      draw(started);
    },
  }), []);
  return <canvas ref={canvasRef} className="visual-pixel-transition" aria-hidden="true" />;
});
export default PixelTransition;

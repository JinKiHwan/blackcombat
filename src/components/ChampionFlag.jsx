import { useEffect, useRef } from 'react';

const stripHeight = 4;

function drawCloth(context, source, width, height, time) {
  const fold = y => {
    const position = y / height;
    return Math.sin(position * Math.PI) *
      Math.sin(position * 12 - time + .35 * Math.sin(position * 19 - time * .65));
  };
  const amplitude = height * .038;
  let top = 0;
  for (let y = 0; y < height; y += stripHeight) {
    const next = Math.min(y + stripHeight, height);
    const bottom = next + fold(next) * amplitude;
    const span = bottom - top;
    const light = (span / (next - y) - 1) * .75;
    const sidePull = Math.sin(y / height * Math.PI) * fold(y) * width * .045;

    context.drawImage(source, 0, y, width, next - y, -width * .06 + sidePull, top, width * 1.12, span + 1);
    context.fillStyle = light < 0
      ? `rgba(0, 0, 0, ${Math.min(-light, .38)})`
      : `rgba(255, 242, 215, ${Math.min(light, .24)})`;
    context.fillRect(0, top, width, span);
    top = bottom;
  }
}

export default function ChampionFlag({ src, index }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const source = document.createElement('canvas');
    const sourceContext = source.getContext('2d');
    if (!context || !sourceContext) return;

    const image = new Image();
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let frame = 0;
    let previous = -Infinity;

    function animate(now) {
      if (now - previous >= 1000 / 30) {
        drawCloth(context, source, canvas.width, canvas.height, now / 410 + index * 1.4);
        previous = now;
      }
      frame = requestAnimationFrame(animate);
    }

    function update() {
      cancelAnimationFrame(frame);
      if (!visible || reducedMotion.matches || !image.naturalWidth) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      canvas.width = source.width = width;
      canvas.height = source.height = height;

      const scale = Math.max(height / image.naturalWidth, width / image.naturalHeight);
      const imageWidth = image.naturalWidth * scale;
      const imageHeight = image.naturalHeight * scale;
      sourceContext.translate(width / 2, height / 2);
      sourceContext.rotate(Math.PI / 2);
      sourceContext.drawImage(image, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
      previous = -Infinity;
      frame = requestAnimationFrame(animate);
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    const resize = new ResizeObserver(update);
    intersection.observe(canvas);
    resize.observe(canvas);
    reducedMotion.addEventListener('change', update);
    image.onload = update;
    image.src = src;

    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      reducedMotion.removeEventListener('change', update);
      image.onload = null;
    };
  }, [src, index]);

  return <div className="champ-flag" aria-hidden="true" style={{ '--champ-flag-image': `url("${src}")` }}>
    <canvas ref={canvasRef} />
  </div>;
}

import { useEffect, useRef } from 'react';
import { fragmentSource, vertexSource } from './smokeShaders.js';

// 사용자 첨부 옵션. 마우스/터치 좌표를 수집하거나 셰이더에 전달하지 않습니다.
export const smokeOptions = Object.freeze({
  speed: 0.15,
  verticalDrift: -0.05,
  density: 0.58,
  turbulence: 1.3,
  wispyDetail: 0.1,
  bottomHeavy: 1,
  colorTint: [0.76, 0.79, 0.84],
});

export default function CinematicSmoke() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!gl) return; // 미지원 환경에서는 원본 비주얼만 표시합니다.

    let frame = 0;
    let visible = true;
    let lost = false;
    let lastTime = 0;
    let time = 15;
    let flowX = 20;
    let flowY = 10;
    const shaders = [];
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function cleanupResources() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    }

    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        cleanupResources();
        return;
      }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      cleanupResources();
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(['resolution', 'time', 'flowTime', 'density', 'turbulence', 'bottomHeavy', 'wispy', 'color'].map(name => [name, gl.getUniformLocation(program, `u_${name}`)]));

    function draw() {
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, time);
      gl.uniform2f(uniforms.flowTime, flowX, flowY);
      gl.uniform1f(uniforms.density, smokeOptions.density);
      gl.uniform1f(uniforms.turbulence, smokeOptions.turbulence);
      gl.uniform1f(uniforms.bottomHeavy, smokeOptions.bottomHeavy);
      gl.uniform1f(uniforms.wispy, smokeOptions.wispyDetail);
      gl.uniform3fv(uniforms.color, smokeOptions.colorTint);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function resize() {
      // 무거운 FBM은 최대 960px 폭·30fps로 렌더링하고 CSS로 확대합니다.
      const scale = Math.min(window.devicePixelRatio || 1, 1, 960 / Math.max(canvas.clientWidth, 1));
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (!lost) draw();
    }

    function render(now) {
      frame = requestAnimationFrame(render);
      if (now - lastTime < 1000 / 30) return;
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
      lastTime = now;
      time += dt;
      flowX += dt * smokeOptions.speed;
      flowY += dt * smokeOptions.verticalDrift;
      draw();
    }

    function updateAnimation() {
      cancelAnimationFrame(frame);
      lastTime = 0;
      if (lost) return;
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(render);
      else if (motion.matches) draw();
    }

    function onContextLost(event) {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
    }

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateAnimation();
    });
    resize();
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener('visibilitychange', updateAnimation);
    motion.addEventListener('change', updateAnimation);
    canvas.addEventListener('webglcontextlost', onContextLost);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', updateAnimation);
      motion.removeEventListener('change', updateAnimation);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      cleanupResources();
    };
  }, []);

  return <canvas ref={canvasRef} className="cinematic-smoke" aria-hidden="true" />;
}

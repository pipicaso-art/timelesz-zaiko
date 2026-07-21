'use client';

import { useEffect } from 'react';

interface Props {
  show: boolean;
  onDone: () => void;
}

const COLORS = [
  '#ff6b9d', '#ff9b42', '#ffd93d', '#6bcb77',
  '#4d96ff', '#c77dff', '#ff6bd6', '#2dd4bf',
  '#ff4757', '#ffdd59', '#7bed9f', '#ff6348',
];

export function Fireworks({ show, onDone }: Props) {
  useEffect(() => {
    if (!show) return;

    // canvasをbodyに直接追加（Reactのレンダリングに依存しない）
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      alpha: number; color: string; size: number;
    }
    interface Rocket {
      x: number; y: number; vy: number; targetY: number;
      color: string; trail: { x: number; y: number }[];
    }

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    function rand(a: number, b: number) { return a + Math.random() * (b - a); }

    function explode(x: number, y: number, color: string) {
      const n = 80 + Math.floor(rand(0, 50));
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i / n) + rand(-0.3, 0.3);
        const s = rand(1.5, 6.5);
        particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.5, alpha: 1, color, size: rand(1.5, 3.5) });
      }
      const c2 = COLORS[Math.floor(rand(0, COLORS.length))];
      for (let i = 0; i < 20; i++) {
        const a = rand(0, Math.PI * 2);
        const s = rand(0.5, 3);
        particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, alpha: 1, color: c2, size: rand(2.5, 4.5) });
      }
    }

    function launch() {
      rockets.push({
        x: rand(60, canvas.width - 60),
        y: canvas.height + 10,
        vy: rand(-11, -15),
        targetY: rand(canvas.height * 0.08, canvas.height * 0.38),
        color: COLORS[Math.floor(rand(0, COLORS.length))],
        trail: [],
      });
    }

    const startTime = Date.now();
    const LAUNCH_DURATION = 3500;
    const TOTAL_DURATION = 5500;
    let lastRocket = 0;
    let animId: number;

    function animate() {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const elapsed = Date.now() - startTime;

      if (elapsed < LAUNCH_DURATION && Date.now() - lastRocket > 320) {
        launch();
        if (Math.random() > 0.45) setTimeout(launch, 150 + Math.random() * 150);
        lastRocket = Date.now();
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 10) r.trail.shift();
        r.y += r.vy;
        r.vy *= 0.985;
        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        } else {
          for (let t = 0; t < r.trail.length; t++) {
            const a = (t / r.trail.length) * 0.7;
            ctx.beginPath();
            ctx.arc(r.trail[t].x, r.trail[t].y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = r.color + Math.floor(a * 255).toString(16).padStart(2, '0');
            ctx.fill();
          }
          ctx.beginPath(); ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#fff'; ctx.fill();
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.07; p.vx *= 0.985; p.vy *= 0.985;
        p.alpha -= 0.015;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        const hex = Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + hex; ctx.fill();
      }

      if (elapsed < TOTAL_DURATION || particles.length > 0 || rockets.length > 0) {
        animId = requestAnimationFrame(animate);
      } else {
        cleanup();
      }
    }

    function cleanup() {
      cancelAnimationFrame(animId);
      if (canvas.parentNode) document.body.removeChild(canvas);
      onDone();
    }

    animate();

    const safetyTimer = setTimeout(cleanup, TOTAL_DURATION + 2000);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(safetyTimer);
      if (canvas.parentNode) document.body.removeChild(canvas);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return null;
}

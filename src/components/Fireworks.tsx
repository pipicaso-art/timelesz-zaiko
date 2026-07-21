'use client';

import { useEffect, useRef } from 'react';

interface Props {
  show: boolean;
  onDone: () => void;
}

const COLORS = [
  '#ff6b9d', '#ff9b42', '#ffd93d', '#6bcb77',
  '#4d96ff', '#c77dff', '#ff6bd6', '#2dd4bf',
  '#ff4757', '#ffdd59', '#7bed9f', '#ff6348',
];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; color: string; size: number;
}
interface Rocket {
  x: number; y: number; vy: number;
  targetY: number; color: string;
  trail: Array<{ x: number; y: number }>;
}

export function Fireworks({ show, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    function createRocket() {
      rockets.push({
        x: 60 + Math.random() * (canvas.width - 120),
        y: canvas.height + 10,
        vy: -(11 + Math.random() * 5),
        targetY: canvas.height * (0.08 + Math.random() * 0.35),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        trail: [],
      });
    }

    function explode(x: number, y: number, color: string) {
      // メイン爆発
      const count = 90 + Math.floor(Math.random() * 50);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 1.5 + Math.random() * 5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          alpha: 1,
          color,
          size: 1.5 + Math.random() * 2.5,
        });
      }
      // スパークル（別の色）
      const sparkColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 3;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: sparkColor,
          size: 2.5 + Math.random() * 2,
        });
      }
    }

    const startTime = Date.now();
    const LAUNCH_DURATION = 3500;
    const TOTAL_DURATION = 5500;
    let lastRocket = 0;

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const elapsed = Date.now() - startTime;

      // ロケット発射
      if (elapsed < LAUNCH_DURATION && Date.now() - lastRocket > 320) {
        createRocket();
        if (Math.random() > 0.45) {
          const delay = 100 + Math.random() * 200;
          setTimeout(createRocket, delay);
        }
        lastRocket = Date.now();
      }

      // ロケット描画
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
          // トレイル
          for (let t = 0; t < r.trail.length; t++) {
            const a = (t / r.trail.length) * 0.7;
            const hex = Math.floor(a * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(r.trail[t].x, r.trail[t].y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = r.color + hex;
            ctx.fill();
          }
          // ロケット本体（白い光）
          ctx.beginPath();
          ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      }

      // パーティクル描画
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07; // 重力
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.alpha -= 0.015;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }

        const hex = Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + hex;
        ctx.fill();
      }

      if (elapsed < TOTAL_DURATION || particles.length > 0 || rockets.length > 0) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onDone();
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animate();

    const safetyTimer = setTimeout(() => {
      cancelAnimationFrame(animRef.current);
      onDone();
    }, TOTAL_DURATION + 2000);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(safetyTimer);
    };
  }, [show, onDone]);

  if (!show) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}

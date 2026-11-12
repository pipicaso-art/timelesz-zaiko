'use client';

import { useEffect, useRef, useState } from 'react';

const QUOTES = [
  'オレたちにできない・やらないはない',
  '夢、全部叶えるぞーーー！',
  '俺は死ぬほど売れたい。こんなんじゃ売れねぇだろ',
  '予約忘れてるようじゃ無理か',
  '自信ないぐらいがちょうどいい',
  '僕が必ず背中押しますから',
  '人生につまらない日はないからね',
  '殻破れよ！終わっちまうぞこんなんじゃ',
  '時間ないで（予約するよね',
  '努力好きなんで（買います！！',
  'この先も必死にくらいついて、どんな壁も乗り越えます、絶対に。',
  'よく寝たわ〜（予約します）',
];

const CELEB_CHARS = [
  { shirt: '#EF4444', hair: '#2D1B00', scale: 7  },
  { shirt: '#8B5CF6', hair: '#1A1A1A', scale: 7  },
  { shirt: '#06B6D4', hair: '#1A1A1A', scale: 7  },
  { shirt: '#22C55E', hair: '#1A1A1A', scale: 7  },
  { shirt: '#84CC16', hair: '#1A1A1A', scale: 7  },
  { shirt: '#D1D5DB', hair: '#FFD700', scale: 10 },
  { shirt: '#EC4899', hair: '#1A1A1A', scale: 7  },
];

const PIXEL_FRAME = [
  [0,0,3,3,3,3,3,3,0,0],
  [0,3,3,3,3,3,3,3,3,0],
  [3,1,1,1,1,1,1,1,1,3],
  [1,1,1,4,1,1,4,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,6,6,6,6,6,6,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [0,2,2,2,2,2,2,2,2,0],
  [2,2,2,2,2,2,2,2,2,2],
  [0,2,2,2,2,2,2,2,2,0],
  [0,0,5,5,0,0,5,5,0,0],
  [0,0,4,4,0,0,4,4,0,0],
  [0,0,0,0,0,0,0,0,0,0],
];
const PIXEL_FRAME2 = [
  [0,0,3,3,3,3,3,3,0,0],
  [0,3,3,3,3,3,3,3,3,0],
  [3,1,1,1,1,1,1,1,1,3],
  [1,1,1,4,1,1,4,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,6,6,6,6,6,6,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [0,2,2,2,2,2,2,2,2,0],
  [2,2,2,2,2,2,2,2,2,2],
  [0,2,2,2,2,2,2,2,2,0],
  [0,5,5,0,0,0,0,5,5,0],
  [0,4,4,0,0,0,0,4,4,0],
  [0,0,0,0,0,0,0,0,0,0],
];

const STAR_FRAME = [
  [0,0,0,1,0,0,0],
  [0,0,1,1,1,0,0],
  [1,1,1,1,1,1,1],
  [0,1,1,1,1,1,0],
  [0,0,1,1,1,0,0],
  [0,1,0,0,0,1,0],
  [1,0,0,0,0,0,1],
];
const STAR_CYCLE = ['#FFD700','#FFF176','#FFE55C','#FFFFFF','#FFD700','#FFE55C'];

const DURATION = 5500;

export function WelcomeCelebration() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dismissRef = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem('welcome_20k_shown')) return;
    sessionStorage.setItem('welcome_20k_shown', '1');
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const ctxMaybe = canvas.getContext('2d');
    if (!ctxMaybe) return;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const STAR_PIX = 7;
    const STAR_PX_W = 7 * STAR_PIX;
    const STAR_PX_H = 7 * STAR_PIX;

    const chars = CELEB_CHARS.map((cfg, i) => {
      const cw = 10 * cfg.scale;
      const ch = 13 * cfg.scale;
      return {
        x: Math.random() * Math.max(W - cw, 1),
        y: H * (0.05 + (i % 7) * 0.13),
        dx: (Math.random() > 0.5 ? 1 : -1) * (2.5 + Math.random() * 2),
        dy: (Math.random() > 0.5 ? 1 : -1) * 0.8,
        shirt: cfg.shirt, hair: cfg.hair, scale: cfg.scale,
        cw, ch, animF: 0, animT: 0,
      };
    });

    const star = {
      x: Math.random() * Math.max(W - STAR_PX_W, 1),
      y: Math.random() * Math.max(H - STAR_PX_H, 1),
      dx: (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 7),
      dy: (Math.random() > 0.5 ? 1 : -1) * (9 + Math.random() * 6),
      colorF: 0, colorT: 0,
    };

    let rayAngle = 0;

    function drawRays(elapsed: number, alpha: number) {
      const cx = W / 2;
      const cy = H * 0.1;
      const numRays = 18;
      const maxLen = Math.sqrt(W * W + H * H) * 1.3;
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2 + rayAngle;
        const spread = 0.065;
        const pulse = 0.12 + 0.06 * Math.sin(elapsed / 350 + i * 1.3);
        const grad = ctx.createLinearGradient(
          cx, cy,
          cx + Math.cos(angle) * maxLen,
          cy + Math.sin(angle) * maxLen
        );
        grad.addColorStop(0,   `rgba(255,230,120,${pulse * alpha})`);
        grad.addColorStop(0.4, `rgba(255,255,200,${pulse * 0.5 * alpha})`);
        grad.addColorStop(1,   `rgba(255,255,255,0)`);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxLen, angle - spread, angle + spread);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
      rayAngle += 0.004;
    }

    function drawChar(x: number, y: number, shirt: string, hair: string, scale: number, frame: number) {
      const grid = frame === 0 ? PIXEL_FRAME : PIXEL_FRAME2;
      const colors: Record<number, string> = {
        1: '#FFCC99', 2: shirt, 3: hair, 4: '#222222', 5: '#1E3A6E', 6: '#CC3333',
      };
      grid.forEach((row, r) => row.forEach((v, c) => {
        if (v === 0) return;
        ctx.fillStyle = colors[v];
        ctx.fillRect(x + c * scale, y + r * scale, scale, scale);
      }));
    }

    function drawStar(x: number, y: number, colorIdx: number) {
      ctx.fillStyle = STAR_CYCLE[colorIdx % STAR_CYCLE.length];
      STAR_FRAME.forEach((row, r) => row.forEach((v, c) => {
        if (v === 0) return;
        ctx.fillRect(x + c * STAR_PIX, y + r * STAR_PIX, STAR_PIX, STAR_PIX);
      }));
    }

    const startTime = performance.now();
    let lastT = startTime;
    let dismissedAt: number | null = null;
    let rafId = 0;

    function animate(now: number) {
      if (dismissRef.current && dismissedAt === null) dismissedAt = now;
      const elapsed = now - startTime;
      const fadeOutStart = dismissedAt !== null ? dismissedAt : (DURATION - 900);
      const remaining = dismissedAt !== null
        ? Math.max(0, 1 - (now - dismissedAt) / 500)
        : elapsed > fadeOutStart
          ? Math.max(0, 1 - (elapsed - fadeOutStart) / 900)
          : 1;
      const alpha = elapsed < 400 ? elapsed / 400 : remaining;

      if (alpha <= 0 || elapsed >= DURATION + 500) {
        ctx.clearRect(0, 0, W, H);
        setVisible(false);
        setDismissed(true);
        return;
      }

      const dt = now - lastT; lastT = now;
      ctx.clearRect(0, 0, W, H);

      // Dark overlay
      ctx.globalAlpha = 0.72 * alpha;
      ctx.fillStyle = '#0a001a';
      ctx.fillRect(0, 0, W, H);

      // Light rays
      ctx.globalAlpha = 1;
      drawRays(elapsed, alpha);

      // Characters
      ctx.globalAlpha = alpha;
      chars.forEach(ch => {
        ch.animT += dt;
        if (ch.animT > 170) { ch.animT = 0; ch.animF = 1 - ch.animF; }
        ch.x += ch.dx; ch.y += ch.dy;
        if (ch.x < 0)        { ch.x = 0;        ch.dx =  Math.abs(ch.dx); }
        if (ch.x > W - ch.cw){ ch.x = W - ch.cw; ch.dx = -Math.abs(ch.dx); }
        if (ch.y < 0)        { ch.y = 0;        ch.dy =  Math.abs(ch.dy); }
        if (ch.y > H - ch.ch){ ch.y = H - ch.ch; ch.dy = -Math.abs(ch.dy); }
        drawChar(Math.round(ch.x), Math.round(ch.y), ch.shirt, ch.hair, ch.scale, ch.animF);
      });

      // Star
      star.colorT += dt;
      if (star.colorT > 100) { star.colorT = 0; star.colorF = (star.colorF + 1) % STAR_CYCLE.length; }
      star.x += star.dx; star.y += star.dy;
      if (star.x < 0)          { star.x = 0;          star.dx =  (9 + Math.random() * 8); }
      if (star.x > W - STAR_PX_W) { star.x = W - STAR_PX_W; star.dx = -(9 + Math.random() * 8); }
      if (star.y < 0)          { star.y = 0;          star.dy =  (8 + Math.random() * 7); }
      if (star.y > H - STAR_PX_H) { star.y = H - STAR_PX_H; star.dy = -(8 + Math.random() * 7); }
      drawStar(Math.round(star.x), Math.round(star.y), star.colorF);

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [visible]);

  if (!visible || dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
      onClick={() => { dismissRef.current = true; }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="relative z-10 flex flex-col items-center pointer-events-none select-none">
        <p
          className="text-yellow-300 font-black text-sm mb-4 tracking-widest"
          style={{ textShadow: '0 0 12px rgba(255,200,0,0.9)' }}
        >
          🎉 予約枚数 2万枚突破！ 🎉
        </p>
        <p
          className="text-white font-black"
          style={{
            writingMode: 'vertical-rl',
            fontSize: '110px',
            maxHeight: '5.5em',
            lineHeight: '1.1',
            textShadow: '0 0 32px rgba(255,220,100,1), 0 0 8px rgba(0,0,0,1)',
          }}
        >
          {quote}
        </p>
      </div>
    </div>
  );
}

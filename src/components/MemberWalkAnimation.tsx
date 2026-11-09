'use client';

import { useEffect, useRef } from 'react';

// 10×13 ピクセルスプライト
// 0=透明 1=肌 2=シャツ(メンバーカラー) 3=髪 4=暗(目/靴) 5=パンツ 6=口
const FRAME1: number[][] = [
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

const FRAME2: number[][] = [
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

const SPRITE_W = 10;
const SPRITE_H = 13;
const SKIN  = '#FFCC99';
const DARK  = '#222222';
const PANTS = '#1E3A6E';
const MOUTH = '#CC3333';

function getColor(val: number, shirt: string, hair: string): string | null {
  if (val === 0) return null;
  if (val === 1) return SKIN;
  if (val === 2) return shirt;
  if (val === 3) return hair;
  if (val === 4) return DARK;
  if (val === 5) return PANTS;
  if (val === 6) return MOUTH;
  return null;
}

function drawChar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  scale: number,
  shirt: string,
  hair: string,
  frame: number
) {
  const grid = frame === 0 ? FRAME1 : FRAME2;
  for (let row = 0; row < SPRITE_H; row++) {
    for (let col = 0; col < SPRITE_W; col++) {
      const color = getColor(grid[row][col], shirt, hair);
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
    }
  }
}

// ⭐ 星ドット絵 7×7
const STAR_FRAME: number[][] = [
  [0,0,0,1,0,0,0],
  [0,0,1,1,1,0,0],
  [1,1,1,1,1,1,1],
  [0,1,1,1,1,1,0],
  [0,0,1,1,1,0,0],
  [0,1,0,0,0,1,0],
  [1,0,0,0,0,0,1],
];
const STAR_W = 7;
const STAR_H = 7;
const STAR_SCALE = 4;
const STAR_COLORS = ['#FFD700', '#FFF176', '#FFE55C', '#FFFFFF', '#FFD700', '#FFE55C'];

// 7人のメンバー（黄色服を除いた7人）
const MEMBERS = [
  { shirt: '#EC4899', hair: '#1A1A1A', scale: 3, speed: 38 },  // ピンク
  { shirt: '#8B5CF6', hair: '#1A1A1A', scale: 3, speed: 42 },  // 紫
  { shirt: '#06B6D4', hair: '#1A1A1A', scale: 3, speed: 35 },  // 水色
  { shirt: '#22C55E', hair: '#1A1A1A', scale: 3, speed: 40 },  // 緑
  { shirt: '#84CC16', hair: '#1A1A1A', scale: 3, speed: 44 },  // 黄緑
  { shirt: '#EF4444', hair: '#2D1B00', scale: 3, speed: 36 },  // 赤
  { shirt: '#D1D5DB', hair: '#FFD700', scale: 5, speed: 30 },  // 🌟金髪でかい（グレー服）
];

interface Char {
  x: number;
  animFrame: number;
  animTimer: number;
  member: typeof MEMBERS[0];
}

interface StarState {
  active: boolean;
  x: number;
  y: number;
  speed: number;
  cooldown: number;
  colorFrame: number;
  colorTimer: number;
}

export function MemberWalkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const charsRef = useRef<Char[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const starRef = useRef<StarState>({
    active: false,
    x: 0,
    y: 0,
    speed: 150,
    cooldown: 4000 + Math.random() * 6000,
    colorFrame: 0,
    colorTimer: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasH = canvas.height;

    // 初期位置をバラバラに配置
    charsRef.current = MEMBERS.map((m, i) => ({
      x: (canvas.width / MEMBERS.length) * i + Math.random() * 20,
      animFrame: i % 2,
      animTimer: Math.random() * 300,
      member: m,
    }));

    function tick(now: number) {
      const dt = Math.min(now - (lastTimeRef.current || now), 50);
      lastTimeRef.current = now;

      ctx!.clearRect(0, 0, canvas!.width, canvasH);

      // ── キャラクター描画 ──
      for (const char of charsRef.current) {
        const m = char.member;
        char.x += (m.speed * dt) / 1000;
        const charW = SPRITE_W * m.scale;
        if (char.x > canvas!.width + charW) {
          char.x = -charW;
        }
        char.animTimer += dt;
        if (char.animTimer >= 280) {
          char.animFrame = char.animFrame === 0 ? 1 : 0;
          char.animTimer = 0;
        }
        const charH = SPRITE_H * m.scale;
        const y = canvasH - charH;
        drawChar(ctx!, char.x, y, m.scale, m.shirt, m.hair, char.animFrame);
      }

      // ── 星アニメーション ──
      const star = starRef.current;
      star.cooldown -= dt;

      if (!star.active && star.cooldown <= 0) {
        star.active = true;
        star.x = -(STAR_W * STAR_SCALE);
        star.y = Math.random() * (canvasH - STAR_H * STAR_SCALE);
        star.speed = 130 + Math.random() * 120;
        star.colorFrame = 0;
        star.colorTimer = 0;
      }

      if (star.active) {
        star.x += (star.speed * dt) / 1000;
        star.colorTimer += dt;
        if (star.colorTimer >= 120) {
          star.colorFrame = (star.colorFrame + 1) % STAR_COLORS.length;
          star.colorTimer = 0;
        }

        if (star.x > canvas!.width + STAR_W * STAR_SCALE) {
          star.active = false;
          star.cooldown = 8000 + Math.random() * 12000;
        } else {
          const color = STAR_COLORS[star.colorFrame];
          for (let row = 0; row < STAR_H; row++) {
            for (let col = 0; col < STAR_W; col++) {
              if (STAR_FRAME[row][col] === 0) continue;
              ctx!.fillStyle = color;
              ctx!.fillRect(
                Math.floor(star.x + col * STAR_SCALE),
                Math.floor(star.y + row * STAR_SCALE),
                STAR_SCALE, STAR_SCALE
              );
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={72}
      className="w-full"
      style={{ imageRendering: 'pixelated', aspectRatio: '800 / 72', height: 'auto' }}
    />
  );
}

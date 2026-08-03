'use client';

import { useEffect } from 'react';

// 表示期間: 〜 2026-08-06 (日本時間)
const SHOW_UNTIL = new Date('2026-08-06T00:00:00+09:00');

// MemberWalkAnimation と同じスプライト定義
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

// MemberWalkAnimation と同じメンバー定義
const MEMBERS = [
  { shirt: '#EC4899', hair: '#1A1A1A', scale: 3 },  // ピンク
  { shirt: '#8B5CF6', hair: '#1A1A1A', scale: 3 },  // 紫
  { shirt: '#06B6D4', hair: '#1A1A1A', scale: 3 },  // 水色
  { shirt: '#22C55E', hair: '#1A1A1A', scale: 3 },  // 緑
  { shirt: '#84CC16', hair: '#1A1A1A', scale: 3 },  // 黄緑
  { shirt: '#EF4444', hair: '#2D1B00', scale: 3 },  // 赤
  { shirt: '#EAB308', hair: '#1A1A1A', scale: 3 },  // 黄色
  { shirt: '#D1D5DB', hair: '#FFD700', scale: 5 },  // 🌟金髪でかい
];

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

export function CelebrationFloats() {
  useEffect(() => {
    if (new Date() > SHOW_UNTIL) return;

    const canvas = document.createElement('canvas');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;image-rendering:pixelated;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;

    const chars = MEMBERS.map((m) => {
      const sw = SPRITE_W * m.scale;
      const sh = SPRITE_H * m.scale;
      return {
        ...m, sw, sh,
        x: Math.random() * (canvas.width  - sw),
        y: Math.random() * (canvas.height - sh),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.6,
        phase:  Math.random() * Math.PI * 2,
        fspeed: 0.018 + Math.random() * 0.012,
        animFrame: 0,
        animTimer: 0,
      };
    });

    function drawChar(c: typeof chars[0]) {
      const grid = c.animFrame === 0 ? FRAME1 : FRAME2;
      const s = c.scale;
      for (let row = 0; row < SPRITE_H; row++) {
        for (let col = 0; col < SPRITE_W; col++) {
          const color = getColor(grid[row][col], c.shirt, c.hair);
          if (!color) continue;
          ctx.fillStyle = color;
          ctx.fillRect(Math.floor(c.x + col * s), Math.floor(c.y + row * s), s, s);
        }
      }
    }

    const LINES = ['消えない花火', 'timelesz', '発売おめでとう！！！！！！'];
    const RAINBOW = ['#FF4081','#FF9800','#FFEB3B','#4CAF50','#00BCD4','#9C27B0','#E91E63'];

    function drawText(frame: number) {
      const cx = canvas.width / 2;
      const pulse = 1 + Math.sin(frame * 0.06) * 0.04;

      LINES.forEach((line, i) => {
        const sizes = [canvas.width * 0.07, canvas.width * 0.055, canvas.width * 0.065];
        const yPos = [canvas.height * 0.30, canvas.height * 0.42, canvas.height * 0.54];
        const size = Math.round(sizes[i] * pulse);
        ctx.font = `900 ${size}px "Hiragino Sans", "Yu Gothic", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 虹色アウトライン
        const colorIdx = (frame + i * 3) % RAINBOW.length;
        ctx.strokeStyle = RAINBOW[colorIdx];
        ctx.lineWidth = size * 0.12;
        ctx.lineJoin = 'round';
        ctx.strokeText(line, cx, yPos[i]);

        // 白テキスト
        ctx.fillStyle = '#ffffff';
        ctx.fillText(line, cx, yPos[i]);
      });
    }

    let animId: number;
    let frame = 0;
    let lastTime = 0;

    function tick(now: number) {
      animId = requestAnimationFrame(tick);
      const dt = Math.min(now - (lastTime || now), 50);
      lastTime = now;
      frame++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const c of chars) {
        // ふわふわ移動
        c.x += c.vx;
        c.y += c.vy + Math.sin(frame * c.fspeed + c.phase) * 0.45;

        // 画面端で反射
        if (c.x < 0)                    { c.x = 0;                    c.vx =  Math.abs(c.vx); }
        if (c.x + c.sw > canvas.width)  { c.x = canvas.width - c.sw;  c.vx = -Math.abs(c.vx); }
        if (c.y < 0)                    { c.y = 0;                    c.vy =  Math.abs(c.vy); }
        if (c.y + c.sh > canvas.height) { c.y = canvas.height - c.sh; c.vy = -Math.abs(c.vy); }

        // 歩行アニメ切り替え
        c.animTimer += dt;
        if (c.animTimer >= 300) {
          c.animFrame = c.animFrame === 0 ? 1 : 0;
          c.animTimer = 0;
        }

        drawChar(c);
      }

      drawText(frame);
    }

    requestAnimationFrame(tick);

    function onResize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (canvas.parentNode) document.body.removeChild(canvas);
    };
  }, []);

  return null;
}

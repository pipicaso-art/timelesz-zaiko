'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SUPABASE_URL, SUPABASE_HEADERS } from '@/lib/supabase';

interface ReservationRow {
  id: string;
  count: number;
}

const BUCKETS = [
  { label: '1000枚以上', min: 1000, max: Infinity },
  { label: '800〜999枚', min: 800, max: 999 },
  { label: '500〜799枚', min: 500, max: 799 },
  { label: '300〜499枚', min: 300, max: 499 },
  { label: '100〜299枚', min: 100, max: 299 },
  { label: '50〜99枚', min: 50, max: 99 },
  { label: '10〜49枚', min: 10, max: 49 },
  { label: '4〜9枚', min: 4, max: 9 },
  { label: '3枚', min: 3, max: 3 },
  { label: '2枚', min: 2, max: 2 },
  { label: '1枚', min: 1, max: 1 },
];

interface BucketResult {
  label: string;
  pct: number;
  count: number;
}

const FUMA_QUOTES = [
  'オレたちにできない・やらないはない',
  '夢、全部叶えるぞーーー！',
  '俺は死ぬほど売れたい。こんなんじゃ売れねぇだろ',
  '予約忘れてるようじゃ無理か',
  '自信ないぐらいがちょうどいい',
  '僕が必ず背中押しますから',
  '人生につまらない日はないからね',
];

// 10×13 ピクセルアート（紫シャツキャラ）
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
// ウォークフレーム2（足を広げたポーズ）
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

const PIXEL_COLORS: Record<number, string> = {
  1: '#FFCC99', 2: '#8B5CF6', 3: '#1A1A1A', 4: '#222222', 5: '#1E3A6E', 6: '#CC3333',
};

// お祝いドット絵キャラがウロウロするcanvasオーバーレイ
const CELEB_SHIRTS = ['#8B5CF6','#EC4899','#06B6D4','#22C55E','#EF4444','#84CC16','#D1D5DB'];
const CELEB_COLORS: Record<number,string> = { 1:'#FFCC99', 3:'#1A1A1A', 4:'#222222', 5:'#1E3A6E', 6:'#CC3333' };

function CelebrationOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SCALE = 7;
    const CW = 10 * SCALE;
    const CH = 13 * SCALE;
    const duration = 2700;

    const chars = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * Math.max(W - CW, 1),
      y: H * (0.15 + (i % 4) * 0.18),
      dx: (Math.random() > 0.5 ? 1 : -1) * (2.5 + Math.random() * 2),
      dy: (Math.random() > 0.5 ? 1 : -1) * 0.6,
      shirt: CELEB_SHIRTS[i % CELEB_SHIRTS.length],
      animF: 0,
      animT: 0,
    }));

    function drawChar(x: number, y: number, shirt: string, frame: number) {
      const grid = frame === 0 ? PIXEL_FRAME : PIXEL_FRAME2;
      grid.forEach((row, r) => row.forEach((v, c) => {
        if (v === 0) return;
        ctx!.fillStyle = v === 2 ? shirt : (CELEB_COLORS[v] ?? '#000');
        ctx!.fillRect(x + c * SCALE, y + r * SCALE, SCALE, SCALE);
      }));
    }

    const startTime = performance.now();
    let lastT = startTime;
    let rafId = 0;

    function animate(now: number) {
      const elapsed = now - startTime;
      if (elapsed >= duration) { ctx!.clearRect(0, 0, W, H); return; }

      const dt = now - lastT; lastT = now;
      ctx!.clearRect(0, 0, W, H);
      ctx!.globalAlpha = elapsed > duration - 700
        ? Math.max(0, 1 - (elapsed - (duration - 700)) / 700)
        : 1;

      chars.forEach(ch => {
        ch.animT += dt;
        if (ch.animT > 170) { ch.animT = 0; ch.animF = 1 - ch.animF; }
        ch.x += ch.dx;
        ch.y += ch.dy;
        if (ch.x < 0) { ch.x = 0; ch.dx = Math.abs(ch.dx); }
        if (ch.x > W - CW) { ch.x = W - CW; ch.dx = -Math.abs(ch.dx); }
        if (ch.y < 0) { ch.y = 0; ch.dy = Math.abs(ch.dy); }
        if (ch.y > H - CH) { ch.y = H - CH; ch.dy = -Math.abs(ch.dy); }
        drawChar(Math.round(ch.x), Math.round(ch.y), ch.shirt, ch.animF);
      });

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ imageRendering: 'pixelated' }} />;
}

function FumaPixelChar({ scale = 2 }: { scale?: number }) {
  const rects: React.ReactElement[] = [];
  PIXEL_FRAME.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v === 0) return;
      rects.push(<rect key={`${r}-${c}`} x={c * scale} y={r * scale} width={scale} height={scale} fill={PIXEL_COLORS[v]}/>);
    })
  );
  return <svg viewBox={`0 0 ${10 * scale} ${13 * scale}`} width={10 * scale} height={13 * scale}>{rects}</svg>;
}

export function ReservationCounter() {
  const [total, setTotal] = useState<number>(0);
  const [top3, setTop3] = useState<number[]>([]);
  const [distribution, setDistribution] = useState<BucketResult[]>([]);
  const [inputCount, setInputCount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mySubmission, setMySubmission] = useState<{ id: string; count: number } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteCount, setDeleteCount] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('reservation_submission');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMySubmission(parsed);
        setSubmitted(true);
      } catch {}
    }
    load();
  }, []);

  async function load() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/reservations?select=id,count&order=count.desc&limit=10000`,
        { headers: SUPABASE_HEADERS }
      );
      const data: ReservationRow[] = await res.json();
      if (!Array.isArray(data)) return;

      const sum = data.reduce((s, r) => s + r.count, 0);
      setTotal(sum);
      setTop3(data.slice(0, 3).map(r => r.count));

      // 分布計算（v2）
      const totalEntries = data.length;
      if (totalEntries > 0) {
        const dist: BucketResult[] = BUCKETS.map(bucket => {
          const cnt = data.filter(r => r.count >= bucket.min && r.count <= bucket.max).length;
          const pct = Math.round((cnt / totalEntries) * 1000) / 10; // 小数点1桁
          return { label: bucket.label, count: cnt, pct };
        });
        setDistribution(dist);
      }
    } catch {}
  }

  async function handleSubmit() {
    const n = parseInt(inputCount);
    if (!n || n < 1 || n > 100000) {
      setError('1〜100,000の数字を入力してください');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
        method: 'POST',
        headers: { ...SUPABASE_HEADERS, Prefer: 'return=representation' },
        body: JSON.stringify({ count: n }),
      });
      const data = await res.json();
      const newId = Array.isArray(data) ? data[0]?.id : data?.id;
      if (newId) {
        const submission = { id: newId, count: n };
        sessionStorage.setItem('reservation_submission', JSON.stringify(submission));
        setMySubmission(submission);
      }
      setSubmitted(true);
      setQuoteIndex(Math.floor(Math.random() * FUMA_QUOTES.length));
      setShowCelebration(true);
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
      celebrationTimer.current = setTimeout(() => setShowCelebration(false), 2800);
      await load();
    } catch {
      setError('送信に失敗しました');
    }
    setLoading(false);
  }

  async function handleDelete() {
    setDeleteLoading(true);
    setError('');
    try {
      if (mySubmission) {
        // sessionStorageにIDがある場合はIDで削除
        await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${mySubmission.id}`, {
          method: 'DELETE',
          headers: SUPABASE_HEADERS,
        });
        sessionStorage.removeItem('reservation_submission');
        setMySubmission(null);
        setSubmitted(false);
        setInputCount('');
      } else {
        // 枚数で検索して削除
        const n = parseInt(deleteCount);
        if (!n || n < 1) { setError('削除する枚数を入力してください'); setDeleteLoading(false); return; }
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/reservations?count=eq.${n}&limit=1`,
          { headers: SUPABASE_HEADERS }
        );
        const rows = await res.json();
        if (!Array.isArray(rows) || rows.length === 0) { setError('該当する申告が見つかりません'); setDeleteLoading(false); return; }
        await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${rows[0].id}`, {
          method: 'DELETE',
          headers: SUPABASE_HEADERS,
        });
        setDeleteCount('');
      }
      await load();
    } catch {
      setError('削除に失敗しました');
    }
    setDeleteLoading(false);
  }

  const medals = ['🥇', '🥈', '🥉'];
  const maxPct = Math.max(...distribution.map(b => b.pct), 1);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-4 relative">
      {/* お祝いアニメーション */}
      {showCelebration && <CelebrationOverlay />}
      {/* タイトル */}
      <h3 className="text-base font-black text-purple-900 tracking-wide mb-3 text-center">
        本当のことを言うとこんなに予約しました
      </h3>

      {/* 合計枚数 */}
      <div className="text-center mb-4">
        <p className="text-xs text-purple-500 mb-1">ファン申告合計</p>
        <p className="text-4xl font-black text-purple-700">
          {total.toLocaleString('ja-JP')}
          <span className="text-lg font-bold ml-1">枚</span>
        </p>
        <p className="text-xs text-purple-400 mt-1">※自己申告制・公式集計ではありません</p>
      </div>

      {/* TOP3 */}
      {top3.length > 0 && (
        <div className="flex gap-2 justify-center mb-2">
          {top3.map((count, i) => (
            <div key={i} className="flex flex-col items-center bg-white border border-purple-100 rounded-lg px-3 py-2 min-w-[72px]">
              <span className="text-lg leading-none mb-1">{medals[i]}</span>
              <span className="text-base font-black text-gray-800">{count.toLocaleString()}</span>
              <span className="text-xs text-gray-400">枚</span>
            </div>
          ))}
        </div>
      )}

      {/* 追い予約メモ */}
      <p className="text-xs text-gray-700 text-center mb-4 font-medium">
        ▼追い予約した人▼<br/>
        前に入力した枚数を削除して合計枚数入れなおしてもOKです！
      </p>

      {/* 入力フォーム */}
      {submitted ? (
        <div className="bg-white rounded-lg py-3 px-4 border border-purple-100 flex items-center gap-3">
          <div className="shrink-0">
            <FumaPixelChar scale={3} />
          </div>
          <p className="text-purple-800 font-bold text-sm leading-snug">
            {FUMA_QUOTES[quoteIndex]}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              min={1}
              max={100000}
              value={inputCount}
              onChange={e => setInputCount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="予約枚数を入力"
              className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-sm font-black px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            {loading ? '送信中…' : '予約した！'}
          </button>
        </div>
      )}

      {/* 削除セクション（常時表示） */}
      <div className="mt-2">
        {mySubmission ? (
          <div className="flex items-center gap-2 bg-white border border-purple-100 rounded-lg px-3 py-2">
            <span className="text-xs text-gray-400 flex-1">
              申告済み：<span className="font-bold text-purple-600">{mySubmission.count.toLocaleString()}枚</span>
            </span>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2 py-1 rounded-lg transition-colors whitespace-nowrap"
            >
              {deleteLoading ? '削除中…' : '削除する'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={1}
              value={deleteCount}
              onChange={e => setDeleteCount(e.target.value)}
              placeholder="申告を削除（枚数入力）"
              className="flex-1 border border-purple-100 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-purple-200 text-gray-500"
            />
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2 py-1 rounded-lg transition-colors whitespace-nowrap"
            >
              {deleteLoading ? '削除中…' : '削除する'}
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}

      {/* 分布図 */}
      {distribution.some(b => b.count > 0) && (
        <div className="mt-4 border-t border-purple-100 pt-3">
          <p className="text-xs font-bold text-purple-700 mb-2">📊 予約枚数の分布</p>
          <div className="space-y-1.5">
            {distribution.map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-24 shrink-0 text-right">{b.label}</span>
                <div className="flex-1 h-2.5 bg-purple-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full transition-all"
                    style={{ width: b.count === 0 ? '0%' : `${Math.max((b.pct / maxPct) * 100, 4)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-purple-700 w-12 text-right">
                  {b.count === 0 ? '0%' : b.pct < 0.1 ? '<0.1%' : `${b.pct}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { SUPABASE_URL, SUPABASE_HEADERS } from '@/lib/supabase';

function FluffyDog() {
  return (
    <svg viewBox="0 0 80 90" width="100" height="112" xmlns="http://www.w3.org/2000/svg">
      {/* 胴体 */}
      <circle cx="22" cy="68" r="12" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      <circle cx="58" cy="68" r="12" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      <ellipse cx="40" cy="62" r="22" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      {/* 前足 */}
      <circle cx="26" cy="80" r="10" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      <circle cx="54" cy="80" r="10" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      {/* 頭 */}
      <circle cx="40" cy="34" r="21" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      {/* ふわふわ毛 */}
      <circle cx="18" cy="24" r="13" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      <circle cx="28" cy="14" r="13" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      <circle cx="40" cy="11" r="13" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      <circle cx="52" cy="14" r="13" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      <circle cx="62" cy="24" r="13" fill="#f5f5f5" stroke="#d0d0d0" strokeWidth="1.2"/>
      {/* 目 */}
      <circle cx="33" cy="34" r="4" fill="#2d2020"/>
      <circle cx="47" cy="34" r="4" fill="#2d2020"/>
      <circle cx="34.2" cy="32.5" r="1.5" fill="white"/>
      <circle cx="48.2" cy="32.5" r="1.5" fill="white"/>
      {/* 鼻 */}
      <ellipse cx="40" cy="40" rx="3.5" ry="2.5" fill="#4a3030"/>
      {/* 口 */}
      <path d="M 36 44 Q 40 48 44 44" stroke="#4a3030" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* 舌 */}
      <ellipse cx="40" cy="48" rx="5.5" ry="4.5" fill="#ffaaaa"/>
      <line x1="40" y1="44" x2="40" y2="52" stroke="#ff9999" strokeWidth="1" strokeLinecap="round"/>
      {/* ハート */}
      <path d="M 62 10 C 62 8 60 6 58 8 C 56 6 54 8 54 10 C 54 13 58 16 58 16 C 58 16 62 13 62 10 Z" fill="#ffb3c6"/>
      <path d="M 72 18 C 72 16.5 70.5 15 69 16.5 C 67.5 15 66 16.5 66 18 C 66 20 69 22 69 22 C 69 22 72 20 72 18 Z" fill="#ffb3c6"/>
    </svg>
  );
}

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
          return { label: bucket.label, count: cnt, pct: Math.round((cnt / totalEntries) * 100) };
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
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <style>{`
            @keyframes dogFloat {
              0%   { transform: translateY(100px) scale(0.8); opacity: 0; }
              15%  { opacity: 1; }
              60%  { transform: translateY(-80px) scale(1.1); opacity: 1; }
              100% { transform: translateY(-160px) scale(1); opacity: 0; }
            }
            @keyframes dotFloat1 {
              0%   { transform: translateY(0) scale(0); opacity: 0; }
              10%  { opacity: 0.9; transform: translateY(0) scale(1); }
              100% { transform: translateY(-220px) scale(0.6); opacity: 0; }
            }
            @keyframes dotFloat2 {
              0%   { transform: translateY(0) scale(0); opacity: 0; }
              15%  { opacity: 0.8; transform: translateY(0) scale(1); }
              100% { transform: translateY(-180px) scale(0.5); opacity: 0; }
            }
            @keyframes dotFloat3 {
              0%   { transform: translateY(0) scale(0); opacity: 0; }
              20%  { opacity: 0.9; transform: translateY(0) scale(1); }
              100% { transform: translateY(-200px) scale(0.4); opacity: 0; }
            }
            .dog-anim { animation: dogFloat 2.6s ease-out forwards; }
            .dot-anim-1 { animation: dotFloat1 2.4s ease-out forwards; animation-delay: 0.1s; }
            .dot-anim-2 { animation: dotFloat2 2.2s ease-out forwards; animation-delay: 0.3s; }
            .dot-anim-3 { animation: dotFloat3 2.5s ease-out forwards; animation-delay: 0.0s; }
            .dot-anim-4 { animation: dotFloat1 2.0s ease-out forwards; animation-delay: 0.5s; }
            .dot-anim-5 { animation: dotFloat2 2.3s ease-out forwards; animation-delay: 0.2s; }
            .dot-anim-6 { animation: dotFloat3 2.1s ease-out forwards; animation-delay: 0.4s; }
          `}</style>
          {/* 犬（中央下から浮かび上がる） */}
          <div className="dog-anim absolute" style={{ bottom: '20%', left: '50%', transform: 'translateX(-50%)' }}>
            <FluffyDog />
          </div>
          {/* 白い水玉 */}
          <div className="dot-anim-1 absolute w-5 h-5 bg-white rounded-full opacity-90" style={{ bottom: '18%', left: '30%' }} />
          <div className="dot-anim-2 absolute w-3 h-3 bg-white rounded-full opacity-80" style={{ bottom: '22%', left: '65%' }} />
          <div className="dot-anim-3 absolute w-6 h-6 bg-white rounded-full opacity-85" style={{ bottom: '15%', left: '45%' }} />
          <div className="dot-anim-4 absolute w-4 h-4 bg-white rounded-full opacity-90" style={{ bottom: '25%', left: '20%' }} />
          <div className="dot-anim-5 absolute w-5 h-5 bg-white rounded-full opacity-80" style={{ bottom: '12%', left: '75%' }} />
          <div className="dot-anim-6 absolute w-3 h-3 bg-white rounded-full opacity-85" style={{ bottom: '30%', left: '55%' }} />
          <div className="dot-anim-1 absolute w-4 h-4 bg-white rounded-full opacity-75" style={{ bottom: '20%', left: '82%' }} />
          <div className="dot-anim-2 absolute w-6 h-6 bg-white rounded-full opacity-80" style={{ bottom: '18%', left: '12%' }} />
        </div>
      )}
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
        <div className="text-center bg-white rounded-lg py-3 border border-purple-100">
          <p className="text-purple-700 font-bold text-sm">🎉 ありがとうございます！</p>
          <p className="text-xs text-gray-400 mt-1">カウントに追加されました</p>
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
                    style={{ width: b.pct === 0 ? '0%' : `${Math.max((b.pct / maxPct) * 100, 4)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-purple-700 w-9 text-right">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

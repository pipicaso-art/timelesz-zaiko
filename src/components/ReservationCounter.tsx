'use client';

import { useEffect, useRef, useState } from 'react';
import { SUPABASE_URL, SUPABASE_HEADERS } from '@/lib/supabase';

function FluffyDog() {
  return (
    <svg viewBox="0 0 120 128" width="120" height="128" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          @keyframes tongueWag {
            0%,100% { transform: scaleY(1) rotate(0deg); }
            25%      { transform: scaleY(1.18) rotate(-4deg); }
            75%      { transform: scaleY(1.18) rotate(4deg); }
          }
          @keyframes earL {
            0%,100% { transform: rotate(0deg); }
            40%      { transform: rotate(-8deg); }
            70%      { transform: rotate(5deg); }
          }
          @keyframes earR {
            0%,100% { transform: rotate(0deg); }
            40%      { transform: rotate(8deg); }
            70%      { transform: rotate(-5deg); }
          }
          .dog-tongue { transform-origin: 60px 68px; animation: tongueWag 0.7s ease-in-out infinite; }
          .dog-ear-l  { transform-origin: 28px 42px; animation: earL 0.9s ease-in-out infinite; }
          .dog-ear-r  { transform-origin: 92px 42px; animation: earR 0.9s ease-in-out infinite 0.1s; }
        `}</style>
      </defs>

      {/* ===== 胴体 ===== */}
      {/* 体メイン */}
      <ellipse cx="60" cy="104" rx="26" ry="22" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      {/* 体のふわふわ輪郭 */}
      <circle cx="36" cy="102" r="16" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      <circle cx="84" cy="102" r="16" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      <circle cx="48" cy="94"  r="14" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      <circle cx="72" cy="94"  r="14" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      {/* 前足（丸いパフ） */}
      <circle cx="40" cy="118" r="14" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      <circle cx="80" cy="118" r="14" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      <circle cx="58" cy="121" r="11" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      <circle cx="62" cy="121" r="11" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>

      {/* ===== 耳（ふわふわサイドバンプ、アニメあり） ===== */}
      <g className="dog-ear-l">
        <circle cx="20" cy="50" r="15" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
        <circle cx="14" cy="40" r="13" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
        <circle cx="22" cy="34" r="12" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      </g>
      <g className="dog-ear-r">
        <circle cx="100" cy="50" r="15" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
        <circle cx="106" cy="40" r="13" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
        <circle cx="98"  cy="34" r="12" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      </g>

      {/* ===== 頭のクラウドバンプ ===== */}
      <circle cx="30" cy="38" r="17" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      <circle cx="90" cy="38" r="17" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      <circle cx="38" cy="22" r="17" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      <circle cx="60" cy="16" r="18" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      <circle cx="82" cy="22" r="17" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>
      {/* 頭メイン */}
      <circle cx="60" cy="52" r="30" fill="#faf8f6" stroke="#c9bfba" strokeWidth="1.1"/>

      {/* ===== 顔パーツ ===== */}
      {/* 目 */}
      <circle cx="49" cy="50" r="4.5" fill="#231515"/>
      <circle cx="71" cy="50" r="4.5" fill="#231515"/>
      <circle cx="50.5" cy="48.2" r="1.6" fill="white"/>
      <circle cx="72.5" cy="48.2" r="1.6" fill="white"/>
      {/* 鼻 */}
      <ellipse cx="60" cy="58" rx="4" ry="3" fill="#3a2020"/>
      {/* 口の形 */}
      <path d="M 53 62 Q 56.5 65 60 64 Q 63.5 65 67 62" stroke="#3a2020" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      {/* ベロ（アニメあり） */}
      <g className="dog-tongue">
        <ellipse cx="60" cy="69" rx="6" ry="5.5" fill="#f4a0a8"/>
        <line x1="60" y1="64" x2="60" y2="74" stroke="#f08090" strokeWidth="1.1" strokeLinecap="round"/>
      </g>

      {/* ===== ピンクハート（右上） ===== */}
      <path d="M 101 14 C 101 12 99 10 97 12 C 95 10 93 12 93 14 C 93 17 97 20 97 20 C 97 20 101 17 101 14 Z" fill="#f4b8c0"/>
      <path d="M 112 22 C 112 20.5 110.5 19 109 20.5 C 107.5 19 106 20.5 106 22 C 106 24.5 109 27 109 27 C 109 27 112 24.5 112 22 Z" fill="#f4b8c0"/>

      {/* ===== 毛並み線（ふわふわ感） ===== */}
      <path d="M 48 80 Q 60 83 72 80" stroke="#c9bfba" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <path d="M 42 70 Q 38 76 36 85" stroke="#c9bfba" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <path d="M 78 70 Q 82 76 84 85" stroke="#c9bfba" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
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

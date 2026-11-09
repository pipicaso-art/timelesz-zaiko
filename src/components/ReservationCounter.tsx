'use client';

import { useEffect, useState } from 'react';
import { SUPABASE_URL, SUPABASE_HEADERS } from '@/lib/supabase';

// 予約入力フォームを表示する期間（11/9〜11/15）
const FORM_UNTIL = new Date('2026-11-16T00:00:00+09:00');

interface ReservationRow {
  id: string;
  count: number;
}

export function ReservationCounter() {
  const [total, setTotal] = useState<number>(0);
  const [top3, setTop3] = useState<number[]>([]);
  const [inputCount, setInputCount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const showForm = new Date() < FORM_UNTIL;

  async function load() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/reservations?select=id,count&order=count.desc&limit=1000`,
        { headers: SUPABASE_HEADERS }
      );
      const data: ReservationRow[] = await res.json();
      if (!Array.isArray(data)) return;
      const sum = data.reduce((s, r) => s + r.count, 0);
      setTotal(sum);
      setTop3(data.slice(0, 3).map(r => r.count));
    } catch {}
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit() {
    const n = parseInt(inputCount);
    if (!n || n < 1 || n > 999) {
      setError('1〜999の数字を入力してください');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
        method: 'POST',
        headers: { ...SUPABASE_HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify({ count: n }),
      });
      setSubmitted(true);
      await load();
    } catch {
      setError('送信に失敗しました');
    }
    setLoading(false);
  }

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🗳️</span>
        <h3 className="text-sm font-black text-purple-900 tracking-wide">
          本当のことを言うとこんなに予約しました
        </h3>
        {showForm && (
          <span className="ml-auto text-xs text-purple-400 font-medium">11/9〜11/15</span>
        )}
      </div>

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
        <div className="flex gap-2 justify-center mb-4">
          {top3.map((count, i) => (
            <div key={i} className="flex flex-col items-center bg-white border border-purple-100 rounded-lg px-3 py-2 min-w-[72px]">
              <span className="text-lg leading-none mb-1">{medals[i]}</span>
              <span className="text-base font-black text-gray-800">{count.toLocaleString()}</span>
              <span className="text-xs text-gray-400">枚</span>
            </div>
          ))}
        </div>
      )}

      {/* 入力フォーム */}
      {showForm && (
        submitted ? (
          <div className="text-center bg-white rounded-lg py-3 border border-purple-100">
            <p className="text-purple-700 font-bold text-sm">🎉 ありがとうございます！</p>
            <p className="text-xs text-gray-400 mt-1">カウントに追加されました</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                min={1}
                max={999}
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
        )
      )}
      {error && <p className="text-xs text-red-500 mt-1 text-center">{error}</p>}
    </div>
  );
}

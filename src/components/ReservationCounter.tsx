'use client';

import { useEffect, useState } from 'react';
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

      // 分布計算
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
      await load();
    } catch {
      setError('送信に失敗しました');
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!mySubmission) return;
    setDeleteLoading(true);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${mySubmission.id}`, {
        method: 'DELETE',
        headers: SUPABASE_HEADERS,
      });
      sessionStorage.removeItem('reservation_submission');
      setMySubmission(null);
      setSubmitted(false);
      setInputCount('');
      await load();
    } catch {
      setError('削除に失敗しました');
    }
    setDeleteLoading(false);
  }

  const medals = ['🥇', '🥈', '🥉'];
  const maxPct = Math.max(...distribution.map(b => b.pct), 1);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-4">
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
      <p className="text-xs text-purple-400 text-center mb-4">
        追い予約した人は最初に入れた枚数を消して合計枚数を入れなおしてOKです！
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

      {/* 前回の申告を削除 */}
      {mySubmission && (
        <div className="flex items-center gap-2 mt-2 bg-white border border-purple-100 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500 flex-1">
            前回の申告：<span className="font-bold text-purple-700">{mySubmission.count.toLocaleString()}枚</span>
          </span>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg transition-colors whitespace-nowrap"
          >
            {deleteLoading ? '削除中…' : '削除する'}
          </button>
        </div>
      )}

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

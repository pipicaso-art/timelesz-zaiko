'use client';

import { useEffect, useState } from 'react';
import { MemberWalkAnimation } from './MemberWalkAnimation';

interface SongStats {
  billboard_count: number;
  own_count: number;
  target: number;
  updated_at: string;
}

function ProgressBar({ current, target, color }: { current: number; target: number; color: string }) {
  const pct = Math.min((current / target) * 100, 100);
  const exceeded = current >= target;

  return (
    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
      {exceeded && (
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs">⭐</span>
      )}
    </div>
  );
}

function formatCount(n: number) {
  return n.toLocaleString('ja-JP');
}

export function SalesProgress() {
  const [stats, setStats] = useState<SongStats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
        <div className="h-3 bg-gray-100 rounded mb-2" />
        <div className="h-3 bg-gray-100 rounded" />
      </div>
    );
  }

  const billboardPct = ((stats.billboard_count / stats.target) * 100).toFixed(1);
  const ownPct = ((stats.own_count / stats.target) * 100).toFixed(1);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* 🎮 メンバーウォーキングアニメーション */}
      <div className="border-b border-gray-100 bg-white">
        <MemberWalkAnimation />
      </div>

      <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          📊 売上枚数
        </h2>
        <span className="text-xs text-gray-400">目標 {formatCount(stats.target)}枚</span>
      </div>

      <div className="space-y-4">
        {/* Billboard Japan */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <a
              href="https://www.billboard-japan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 hover:underline hover:text-emerald-600 transition-colors"
            >
              Billboard Japan ↗
            </a>
            <span className="text-sm font-bold text-emerald-600">
              {formatCount(stats.billboard_count)}
              <span className="text-gray-400 font-normal text-xs ml-1">/ {formatCount(stats.target)}</span>
            </span>
          </div>
          <ProgressBar current={stats.billboard_count} target={stats.target} color="bg-emerald-500" />
          {stats.billboard_count >= stats.target && (
            <p className="text-xs text-emerald-600 mt-1 font-medium">🎉 目標達成！</p>
          )}
        </div>

        {/* 自主計算 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-700">オリコン</span>
            <span className="text-sm font-bold text-gray-700">
              {formatCount(stats.own_count)}
              <span className="text-gray-400 font-normal text-xs ml-1">
                / {formatCount(stats.target)} ({ownPct}%)
              </span>
            </span>
          </div>
          <ProgressBar current={stats.own_count} target={stats.target} color="bg-blue-400" />
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        ※各チャートの公式集計
      </p>
      </div>
    </div>
  );
}

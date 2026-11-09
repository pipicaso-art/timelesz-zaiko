'use client';

import { useState, useEffect } from 'react';

const RELEASE_DATE = new Date('2027-02-03T00:00:00+09:00');

export function ReleaseCountdown() {
  const [daysUntil, setDaysUntil] = useState<number | null>(null);

  useEffect(() => {
    function calc() {
      const now = new Date();
      const diff = RELEASE_DATE.getTime() - now.getTime();
      setDaysUntil(Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    calc();
    // 1時間ごとに更新
    const timer = setInterval(calc, 1000 * 60 * 60);
    return () => clearInterval(timer);
  }, []);

  if (daysUntil === null) return null;

  if (daysUntil > 0) {
    return (
      <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 mb-5">
        <span className="text-emerald-700 font-black text-2xl">{daysUntil}</span>
        <span className="text-emerald-600 text-sm">日後に発売</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 mb-5">
      <span className="text-emerald-700 font-bold">🎉 発売中！</span>
    </div>
  );
}

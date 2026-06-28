'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { EDITION_LABELS, STOCK_RANGE_LABELS, STOCK_RANGE_COLORS } from '@/types';
import type { Edition, StockRange } from '@/types';
import { SUPABASE_URL, SUPABASE_HEADERS } from '@/lib/supabase';

interface RecentUpdate {
  id: string;
  edition: string;
  quantity_range: string;
  note: string | null;
  created_at: string;
  stores: {
    id: string;
    name: string;
    prefecture: string;
    prefecture_code: string;
  } | null;
}

export function RecentUpdates() {
  const [updates, setUpdates] = useState<RecentUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${SUPABASE_URL}/rest/v1/stock_updates?select=id,edition,quantity_range,note,created_at,stores(id,name,prefecture,prefecture_code)&order=created_at.desc&limit=10`,
      { headers: SUPABASE_HEADERS }
    )
      .then((r) => r.json())
      .then((data) => {
        setUpdates(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-400 text-sm animate-pulse">読み込み中...</div>;
  }

  if (updates.length === 0) {
    return <div className="text-gray-400 text-sm">まだ更新がありません</div>;
  }

  return (
    <ul className="space-y-2">
      {updates.map((update) => {
        const store = update.stores;
        if (!store) return null;
        const range = update.quantity_range as StockRange;
        const edition = update.edition as Edition;
        return (
          <li key={update.id} className="text-sm">
            <Link
              href={`/stock/${store.prefecture_code}`}
              className="hover:text-emerald-600 transition-colors"
            >
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-gray-800 font-medium">{store.name}</span>
                <span
                  className={`inline-block rounded px-1.5 py-0.5 text-xs font-bold ${STOCK_RANGE_COLORS[range] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {STOCK_RANGE_LABELS[range] ?? update.quantity_range}
                </span>
              </div>
              <div className="text-gray-400 text-xs mt-0.5">
                {EDITION_LABELS[edition] ?? update.edition} ·{' '}
                {formatDistanceToNow(new Date(update.created_at), {
                  addSuffix: true,
                  locale: ja,
                })}
              </div>
              {update.note && (
                <div className="text-gray-500 text-xs">{update.note}</div>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

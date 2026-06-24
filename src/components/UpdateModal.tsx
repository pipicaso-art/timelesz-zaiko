'use client';

import { useState } from 'react';
import type { Store, Edition, StockRange } from '@/types';
import { EDITION_LABELS, STOCK_RANGE_LABELS } from '@/types';

interface Props {
  store: Store;
  onClose: () => void;
  onSuccess: () => void;
}

const EDITIONS: Edition[] = ['first_a', 'first_b', 'normal'];
const RANGES: StockRange[] = ['500+', '200-499', '30-199', '1-29', 'none'];

export function UpdateModal({ store, onClose, onSuccess }: Props) {
  const [edition, setEdition] = useState<Edition>('first_a');
  const [range, setRange] = useState<StockRange>('30-199');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_id: store.id,
          edition,
          quantity_range: range,
          note: note.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '更新に失敗しました');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-1">在庫を更新</h2>
        <p className="text-gray-500 text-sm mb-4">{store.name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 盤種 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              盤種
            </label>
            <div className="flex gap-2 flex-wrap">
              {EDITIONS.map((ed) => (
                <button
                  key={ed}
                  type="button"
                  onClick={() => setEdition(ed)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    edition === ed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {EDITION_LABELS[ed]}
                </button>
              ))}
            </div>
          </div>

          {/* 在庫数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              在庫数
            </label>
            <div className="flex gap-2 flex-wrap">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    range === r
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {STOCK_RANGE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {/* メモ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メモ（任意）
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例：通常盤完売、特典付き"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              maxLength={100}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {submitting ? '送信中...' : '更新する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

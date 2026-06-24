'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Store, Edition, StockRange } from '@/types';
import { EDITION_LABELS, STOCK_RANGE_LABELS, STOCK_RANGE_COLORS } from '@/types';
import { UpdateModal } from '@/components/UpdateModal';
import { CommentSection } from '@/components/CommentSection';

interface StockEntry {
  quantity_range: StockRange;
  note: string | null;
  created_at: string;
}

interface Props {
  prefectureCode: string;
}

const EDITIONS: Edition[] = ['first_a', 'first_b', 'normal'];

const STOCK_ORDER: Record<string, number> = {
  '500+': 0,
  '200-499': 1,
  '30-199': 2,
  '1-29': 3,
  'none': 4,
  'unknown': 5,
};

type SortType = 'stock' | 'name' | 'recent' | 'distance';

function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getBestStock(storeStock: Record<string, StockEntry>): StockRange {
  const entries = Object.values(storeStock);
  if (entries.length === 0) return 'unknown';
  const ranges = entries.map((e) => e.quantity_range as StockRange);
  // 全盤種が「在庫なし」の場合のみ在庫なしを表示
  if (ranges.length === EDITIONS.length && ranges.every((r) => r === 'none')) return 'none';
  // それ以外は在庫なし以外の中で最善を返す
  const nonNone = ranges.filter((r) => r !== 'none');
  if (nonNone.length === 0) return 'unknown';
  return nonNone.sort((a, b) => (STOCK_ORDER[a] ?? 5) - (STOCK_ORDER[b] ?? 5))[0] ?? 'unknown';
}

function getLatestUpdate(storeStock: Record<string, StockEntry>): string | null {
  const entries = Object.values(storeStock);
  if (entries.length === 0) return null;
  return entries
    .map((e) => e.created_at)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null;
}

export function StoreList({ prefectureCode }: Props) {
  const [stores, setStores] = useState<Store[]>([]);
  const [stock, setStock] = useState<Record<string, Record<Edition, StockEntry>>>({});
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('stock');
  const [sortOpen, setSortOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [distances, setDistances] = useState<Record<string, number>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stock?prefecture=${prefectureCode}`);
      const data = await res.json();
      setStores(data.stores || []);
      setStock(data.stock || {});
    } finally {
      setLoading(false);
    }
  }, [prefectureCode]);

  useEffect(() => {
    loadData();
    try {
      const saved = localStorage.getItem('timelesz-favorites');
      if (saved) setFavorites(new Set(JSON.parse(saved)));
    } catch {}
  }, [loadData]);

  useEffect(() => {
    if (!userCoords || stores.length === 0) return;
    const dist: Record<string, number> = {};
    for (const store of stores) {
      if (store.latitude != null && store.longitude != null) {
        dist[store.id] = calcDistance(userCoords.lat, userCoords.lon, store.latitude, store.longitude);
      }
    }
    setDistances(dist);
  }, [userCoords, stores]);

  function toggleFavorite(storeId: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(storeId)) next.delete(storeId);
      else next.add(storeId);
      try {
        localStorage.setItem('timelesz-favorites', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      alert('このブラウザでは現在地の取得ができません');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lon: longitude });
        setSortType('distance');
        setLocating(false);
      },
      () => {
        alert('位置情報の取得を許可してください');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const SORT_LABELS: Record<SortType, string> = {
    stock: '在庫が多い順',
    name: '名前順',
    recent: '最近更新された順',
    distance: '現在地から近い順',
  };

  const filtered = stores.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aFav = favorites.has(a.id) ? 0 : 1;
    const bFav = favorites.has(b.id) ? 0 : 1;
    if (aFav !== bFav) return aFav - bFav;

    if (sortType === 'distance') {
      const aDist = distances[a.id] ?? Infinity;
      const bDist = distances[b.id] ?? Infinity;
      return aDist - bDist;
    }
    if (sortType === 'name') {
      return a.name.localeCompare(b.name, 'ja');
    }
    if (sortType === 'recent') {
      const aTime = getLatestUpdate(stock[a.id] || {});
      const bTime = getLatestUpdate(stock[b.id] || {});
      if (!aTime && !bTime) return 0;
      if (!aTime) return 1;
      if (!bTime) return -1;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    }
    const aStock = STOCK_ORDER[getBestStock(stock[a.id] || {})] ?? 5;
    const bStock = STOCK_ORDER[getBestStock(stock[b.id] || {})] ?? 5;
    return aStock - bStock;
  });

  return (
    <>
      {/* 現在地モード表示 */}
      {sortType === 'distance' && userCoords && (
        <div className="mb-3 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          現在地から近い順で表示中
        </div>
      )}

      {/* 検索・ソートバー */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        {/* 店舗名検索 */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="店舗名で検索..."
            className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>

        {/* ソート */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-emerald-500 transition-colors min-w-[170px] justify-between"
          >
            <span>{SORT_LABELS[sortType]}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {sortOpen && (
            <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[190px] overflow-hidden">
              {(['stock', 'name', 'recent', 'distance'] as SortType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => { setSortType(type); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                    sortType === type
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {sortType === type ? (
                    <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="w-4 shrink-0" />
                  )}
                  {SORT_LABELS[type]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 現在地から探す */}
        <button
          onClick={handleLocate}
          disabled={locating}
          className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50 whitespace-nowrap ${
            sortType === 'distance'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
              : 'bg-white border-gray-300 text-gray-700 hover:border-emerald-500'
          }`}
        >
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {locating ? '取得中...' : '現在地から探す'}
        </button>
      </div>

      {/* 件数表示 */}
      {searchQuery && (
        <p className="text-sm text-gray-500 mb-3">
          「{searchQuery}」の検索結果：{sorted.length}件
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse h-24" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          {searchQuery ? '該当する店舗が見つかりません' : 'この都道府県の店舗データがありません'}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((store) => {
            const storeStock = stock[store.id] || {};
            const isFavorite = favorites.has(store.id);
            const bestRange = getBestStock(storeStock as Record<string, StockEntry>);
            const latestTime = getLatestUpdate(storeStock as Record<string, StockEntry>);
            const dist = distances[store.id];

            return (
              <div
                key={store.id}
                className={`bg-white border rounded-xl p-4 transition-colors shadow-sm ${
                  isFavorite ? 'border-emerald-300' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-sm">{store.name}</h3>
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                          bestRange !== 'unknown'
                            ? STOCK_RANGE_COLORS[bestRange]
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {bestRange !== 'unknown' ? STOCK_RANGE_LABELS[bestRange] : '未更新'}
                      </span>
                      {/* 距離バッジ */}
                      {sortType === 'distance' && dist != null && (
                        <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5">
                          {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}
                        </span>
                      )}
                    </div>
                    {store.address && (
                      <p className="text-gray-400 text-xs mt-0.5">{store.address}</p>
                    )}
                    {latestTime && (
                      <p className="text-gray-400 text-xs mt-0.5">
                        最終更新：{formatDistanceToNow(new Date(latestTime), { addSuffix: true, locale: ja })}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleFavorite(store.id)}
                      className={`text-lg transition-colors ${
                        isFavorite ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-400'
                      }`}
                      title={isFavorite ? 'お気に入り解除' : 'お気に入りに追加'}
                    >
                      {isFavorite ? '★' : '☆'}
                    </button>
                    <button
                      onClick={() => setSelectedStore(store)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      更新
                    </button>
                  </div>
                </div>

                {/* 盤種別在庫 */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {EDITIONS.map((ed) => {
                    const entry = (storeStock as Record<string, StockEntry>)[ed];
                    const colorClass = entry
                      ? STOCK_RANGE_COLORS[entry.quantity_range as StockRange] ?? 'bg-gray-100 text-gray-500'
                      : 'bg-gray-100 text-gray-400';
                    return (
                      <div
                        key={ed}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${colorClass}`}
                      >
                        <div className="opacity-80 text-[10px] leading-none mb-0.5">{EDITION_LABELS[ed]}</div>
                        <div className="font-bold">
                          {entry
                            ? (STOCK_RANGE_LABELS[entry.quantity_range as StockRange] ?? entry.quantity_range)
                            : '未更新'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* メモ（盤種別） */}
                {EDITIONS.map((ed) => {
                  const entry = (storeStock as Record<string, StockEntry>)[ed];
                  if (!entry?.note) return null;
                  return (
                    <p key={ed} className="mt-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5">
                      <span className="font-medium text-gray-600">{EDITION_LABELS[ed]}：</span>
                      {entry.note}
                    </p>
                  );
                })}

                {/* コメント */}
                <CommentSection storeId={store.id} />
              </div>
            );
          })}
        </div>
      )}

      {selectedStore && (
        <UpdateModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
          onSuccess={loadData}
        />
      )}

      {sortOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setSortOpen(false)}
        />
      )}
    </>
  );
}

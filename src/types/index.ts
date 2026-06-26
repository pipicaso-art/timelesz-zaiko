export type StockRange =
  | '500+'
  | '200-499'
  | '30-199'
  | '1-29'
  | 'none'
  | 'unknown';

export type Edition =
  | 'first_a'
  | 'first_b'
  | 'normal';

export const EDITION_LABELS: Record<Edition, string> = {
  first_a: '初回限定盤A',
  first_b: '初回限定盤B',
  normal: '通常盤',
};

export const STOCK_RANGE_LABELS: Record<StockRange, string> = {
  '500+': '500枚以上',
  '200-499': '200-499枚',
  '30-199': '30-199枚',
  '1-29': '1-29枚',
  none: '在庫なし',
  unknown: '未更新',
};

export const STOCK_RANGE_COLORS: Record<StockRange, string> = {
  '500+': 'bg-green-500 text-white',
  '200-499': 'bg-green-400 text-white',
  '30-199': 'bg-yellow-400 text-black',
  '1-29': 'bg-orange-400 text-white',
  none: 'bg-red-500 text-white',
  unknown: 'bg-gray-600 text-gray-300',
};

export interface Store {
  id: string;
  name: string;
  prefecture: string;
  prefecture_code: string;
  address?: string;
  url?: string;
  latitude?: number | null;
  longitude?: number | null;
  oricon?: boolean;
  billboard?: boolean;
  created_at?: string;
}

export interface StockUpdate {
  id: string;
  store_id: string;
  edition: Edition;
  quantity_range: StockRange;
  note?: string;
  created_at: string;
  store?: Store;
}

export interface StoreStock {
  store: Store;
  stock: Partial<Record<Edition, StockUpdate>>;
}

export interface Prefecture {
  name: string;
  code: string;
  region: string;
}

-- timelesz在庫チェッカー データベーススキーマ
-- Supabaseのダッシュボード > SQL Editor で実行してください

-- 店舗テーブル
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  prefecture_code TEXT NOT NULL,
  address TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 在庫更新テーブル
CREATE TABLE IF NOT EXISTS stock_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  edition TEXT NOT NULL CHECK (edition IN ('first_a', 'first_b', 'normal')),
  quantity_range TEXT NOT NULL CHECK (quantity_range IN ('500+', '200-499', '30-199', '1-29', 'none')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- インデックス（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_stores_prefecture_code ON stores(prefecture_code);
CREATE INDEX IF NOT EXISTS idx_stock_updates_store_id ON stock_updates(store_id);
CREATE INDEX IF NOT EXISTS idx_stock_updates_created_at ON stock_updates(created_at DESC);

-- 最新在庫ビュー（各店舗・各盤種の最新データ）
CREATE OR REPLACE VIEW latest_stock AS
SELECT DISTINCT ON (store_id, edition)
  su.id,
  su.store_id,
  su.edition,
  su.quantity_range,
  su.note,
  su.created_at,
  s.name AS store_name,
  s.prefecture,
  s.prefecture_code
FROM stock_updates su
JOIN stores s ON su.store_id = s.id
ORDER BY store_id, edition, created_at DESC;

-- Row Level Security（RLS）の設定
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_updates ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能
CREATE POLICY "Allow public read stores"
  ON stores FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public read stock_updates"
  ON stock_updates FOR SELECT TO anon USING (true);

-- 誰でも在庫更新を投稿可能（ログイン不要）
CREATE POLICY "Allow public insert stock_updates"
  ON stock_updates FOR INSERT TO anon WITH CHECK (true);

-- latest_stockビューへのアクセス権
GRANT SELECT ON latest_stock TO anon;

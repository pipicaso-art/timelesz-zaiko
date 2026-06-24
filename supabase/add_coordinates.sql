-- stores テーブルに緯度・経度カラムを追加
-- Supabase SQL Editor で実行してください

ALTER TABLE stores ADD COLUMN IF NOT EXISTS latitude FLOAT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS longitude FLOAT;

-- インデックス（位置情報検索の高速化）
CREATE INDEX IF NOT EXISTS idx_stores_coordinates ON stores(latitude, longitude);

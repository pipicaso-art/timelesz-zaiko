-- 売上データテーブル
CREATE TABLE IF NOT EXISTS song_stats (
  id SERIAL PRIMARY KEY,
  billboard_count INTEGER NOT NULL DEFAULT 0,
  own_count INTEGER NOT NULL DEFAULT 0,
  target INTEGER NOT NULL DEFAULT 500000,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE song_stats ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY "anyone can read song_stats" ON song_stats
  FOR SELECT TO anon USING (true);

-- 初期データ
INSERT INTO song_stats (billboard_count, own_count, target)
VALUES (505044, 488000, 500000);

-- ========================================================
-- 1. visits テーブル（訪問者数）RLS修正
-- ========================================================
-- visitsテーブルが空の場合はRLSでinsertが拒否されている可能性があります

-- visitsテーブルが存在しない場合は作成
CREATE TABLE IF NOT EXISTS visits (
  id         bigserial PRIMARY KEY,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS有効化
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- 既存ポリシーを削除して再作成
DROP POLICY IF EXISTS "allow anon insert" ON visits;
DROP POLICY IF EXISTS "allow anon select" ON visits;

-- 匿名ユーザーのinsertを許可
CREATE POLICY "allow anon insert" ON visits
  FOR INSERT TO anon WITH CHECK (true);

-- adminからselectできるよう許可（anonでもOK）
CREATE POLICY "allow anon select" ON visits
  FOR SELECT TO anon USING (true);

-- ========================================================
-- 2. reservation_actions テーブル（予約・削除アクション）
-- ========================================================
CREATE TABLE IF NOT EXISTS reservation_actions (
  id         bigserial PRIMARY KEY,
  action     text NOT NULL CHECK (action IN ('reserve', 'delete')),
  created_at timestamptz DEFAULT now()
);

-- RLS有効化
ALTER TABLE reservation_actions ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーのinsertを許可
DROP POLICY IF EXISTS "allow anon insert" ON reservation_actions;
DROP POLICY IF EXISTS "allow anon select" ON reservation_actions;

CREATE POLICY "allow anon insert" ON reservation_actions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow anon select" ON reservation_actions
  FOR SELECT TO anon USING (true);

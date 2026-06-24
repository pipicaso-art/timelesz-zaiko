# timelesz在庫チェッカー

timelesz「消えない花火」（2026年7月29日発売）の全国CDショップ在庫状況をファン同士で更新・共有できるファンサイトです。

> ※このサイトはファンによる非公式サイトです。timelesz・STARTO ENTERTAINMENTとは無関係です。

---

## セットアップ手順

### 1. Supabaseプロジェクトを作成

1. [https://supabase.com](https://supabase.com) にアクセスしてアカウント作成・ログイン
2. 「New project」でプロジェクト作成（名前は `timelesz-zaiko` など）
3. プロジェクト作成完了まで待つ

### 2. データベースのセットアップ

1. Supabaseダッシュボードの「SQL Editor」を開く
2. `supabase/schema.sql` の内容をコピー＆ペーストして実行
3. 続けて `supabase/seed.sql` の内容をコピー＆ペーストして実行（全国の店舗データが登録されます）

### 3. 環境変数を設定

1. `.env.local.example` を `.env.local` にコピー
2. Supabaseダッシュボードの「Settings > API」から以下を取得して入力：
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon / public key

```bash
cp .env.local.example .env.local
# .env.local を編集して値を入力
```

### 4. 依存関係をインストール

```bash
npm install
```

### 5. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

---

## Vercelへのデプロイ

1. [https://vercel.com](https://vercel.com) にログイン
2. 「New Project」でこのリポジトリをインポート
3. 「Environment Variables」に以下を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 「Deploy」をクリック

---

## 機能

- 📍 全国47都道府県の主要CDショップを収録
- 📊 盤種別（初回限定盤A・B・通常盤）の在庫状況表示
- ✏️ ファンが在庫情報を更新・共有（ログイン不要）
- ⭐ お気に入り店舗の登録（ブラウザに保存）
- 🕐 最近の更新履歴表示
- 🛒 オンラインストアへのリンク集

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL + REST API)
- **デプロイ**: Vercel

---

## 店舗を追加したい場合

Supabaseダッシュボードの「Table Editor」から `stores` テーブルに直接追加できます：

| カラム | 値の例 |
|--------|--------|
| name | タワーレコード 渋谷店 |
| prefecture | 東京都 |
| prefecture_code | tokyo |
| address | 渋谷区神南1-22-14 |

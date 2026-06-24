import type { Metadata } from 'next';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { StoreList } from '../[prefecture]/StoreList';

export const metadata: Metadata = {
  title: '練習用デモ | timelesz在庫チェッカー',
  description: '在庫情報の更新方法を練習できるデモページです',
};

export default function DemoPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        {/* パンくず */}
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            ホーム
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">練習用デモ店舗</span>
        </nav>

        {/* タイトル */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">✏️</span>
            <h1 className="text-2xl font-black text-gray-900">練習用デモ店舗の在庫</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            実際の更新操作を練習できます。ここでの更新は本番データには影響しません。
          </p>
        </div>

        {/* 練習用バナー */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          <strong>✏️ 練習モード</strong>
          <br />
          「更新」ボタンを押して、在庫情報の入力方法を確認できます。
        </div>

        {/* 店舗リスト */}
        <StoreList prefectureCode="demo" />
      </div>

      <Sidebar />
    </main>
  );
}

import Link from 'next/link';
import { PrefectureList } from './PrefectureList';
import { RecentUpdates } from './RecentUpdates';
import { SalesProgress } from './SalesProgress';

export function Sidebar() {
  return (
    <aside className="w-72 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-4">
        {/* 売上進捗 */}
        <SalesProgress />

        {/* 最近の更新 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            最近の更新
          </h2>
          <RecentUpdates />
        </div>

        {/* ナビゲーション */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            メニュー
          </h2>
          <nav className="space-y-1">
            <Link href="/" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors py-1">
              🏠 ホーム
            </Link>
            <Link href="/onlinestore" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors py-1">
              🛒 オンラインで購入はこちらから
            </Link>
            <Link href="/stock/demo" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors py-1">
              ✏️ 練習用
            </Link>
          </nav>
        </div>

        {/* 都道府県リスト */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            都道府県から探す
          </h2>
          <PrefectureList />
        </div>
      </div>
    </aside>
  );
}

import { Sidebar } from '@/components/Sidebar';
import { PrefectureList } from '@/components/PrefectureList';
import { SalesProgress } from '@/components/SalesProgress';

const RELEASE_DATE = new Date('2026-07-29T00:00:00+09:00');

function getDaysUntilRelease() {
  const now = new Date();
  const diff = RELEASE_DATE.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function HomePage() {
  const daysUntil = getDaysUntilRelease();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      {/* メインコンテンツ */}
      <div className="flex-1 min-w-0 space-y-6">

        {/* CD情報カード */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* タイトル・カウントダウン */}
          <p className="text-emerald-600 text-sm font-bold uppercase tracking-widest mb-2">
            timelesz 29th Single
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            消えない花火
          </h1>
          <p className="text-gray-500 mb-4">2026年7月29日（水）発売</p>

          {daysUntil > 0 ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 mb-5">
              <span className="text-emerald-700 font-black text-2xl">{daysUntil}</span>
              <span className="text-emerald-600 text-sm">日後に発売</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 mb-5">
              <span className="text-emerald-700 font-bold">🎉 発売中！</span>
            </div>
          )}

          {/* 売上進捗（カード内・PC/スマホ共通） */}
          <SalesProgress />

          {/* 主要3盤種 */}
          <div className="mt-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">発売CDの種類</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '初回限定盤A', desc: 'CD+DVD' },
                { label: '初回限定盤B', desc: 'CD+DVD' },
                { label: '通常盤', desc: 'CD only' },
              ].map((ed) => (
                <div
                  key={ed.label}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center"
                >
                  <div className="text-base leading-none mb-1">💿</div>
                  <div className="font-black text-sm text-gray-900 leading-tight">{ed.label}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{ed.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-2 text-center">※3形態同時購入で特典あり</p>

          {/* その他2種（目立たなく） */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
            <span>🌐 UNIVERSAL MUSIC STORE限定盤（申し込み終了）</span>
            <span>🎪 ツアー会場限定版（会場のみ）</span>
          </div>
        </div>

        {/* 売上進捗（スマホ用：サイドバーがない幅で表示） */}
        <div className="lg:hidden hidden">
          <SalesProgress />
        </div>

        {/* Xポスト促進 */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-gray-600 text-sm mb-3">
            在庫情報はXでも共有してください！
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <a
              href="/stock/demo"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
            >
              ✏️ まず練習！
            </a>
            <a
              href="https://x.com/intent/tweet?text=%23timelesz%E5%9C%A8%E5%BA%AB%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%20%23TSZ%E5%9C%A8%E5%BA%AB%E6%83%85%E5%A0%B1_%E6%B6%88%E3%81%88%E3%81%AA%E3%81%84%E8%8A%B1%E7%81%AB%20https%3A%2F%2Ftimelesz-zaiko-dnik.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              ポスト（リンク付き）
            </a>
            <a
              href="https://x.com/intent/tweet?text=%23timelesz%E5%9C%A8%E5%BA%AB%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%20%23TSZ%E5%9C%A8%E5%BA%AB%E6%83%85%E5%A0%B1_%E6%B6%88%E3%81%88%E3%81%AA%E3%81%84%E8%8A%B1%E7%81%AB"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              ポスト（#のみ）
            </a>
          </div>
        </div>

        {/* 都道府県一覧 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">店舗在庫を都道府県から探す</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <PrefectureList />
          </div>
        </div>

        {/* オンラインストアへのリンク */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            <a href="/onlinestore" className="hover:text-emerald-600 transition-colors">
              オンラインで購入はこちらから →
            </a>
          </h2>
        </div>

      </div>

      {/* サイドバー */}
      <Sidebar />
    </main>
  );
}

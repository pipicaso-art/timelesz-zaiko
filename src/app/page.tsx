import { Sidebar } from '@/components/Sidebar';
import { PrefectureList } from '@/components/PrefectureList';
import { SalesProgress } from '@/components/SalesProgress';
import { ReleaseCountdown } from '@/components/ReleaseCountdown';
export default function HomePage() {

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm font-bold text-gray-900 tracking-widest">
              2027.02.03 RELEASE &nbsp;/&nbsp; SINGLE
            </p>
            <ReleaseCountdown />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">ザユウノメイ /</h1>
          <p className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">本当のことを言うと</p>
          <p className="text-base italic text-gray-500 mb-4">timelesz</p>
          <a
            href="https://timelesz.lnk.to/honkoto_1125"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-700 text-sm font-bold px-4 py-2 rounded-full transition-colors mb-4">
            🎵 「本当のことを言うと」先行配信中
          </a>
          <SalesProgress />
          <p className="text-xs text-gray-400 mt-2 text-center">※3形態同時予約購入特典あり（詳細後日解禁）</p>
          <p className="text-xs text-gray-400 mt-1 text-center">※FC会員限定盤は受注生産限定（予約期間：〜2026/12/21）</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-gray-600 text-sm mb-3">在庫情報はXでも共有してください！</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <a href="/stock/demo"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
              ✏️ まず練習！
            </a>
            <a href="https://x.com/intent/tweet?text=%23TSZ%E5%9C%A8%E5%BA%AB%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%20%23TSZ%E5%9C%A8%E5%BA%AB%E6%83%85%E5%A0%B1_%E3%82%B6%E3%83%A6%E3%82%A6%E3%83%8E%E3%83%A1%E3%82%A4%20%23timelesz_%E3%82%B6%E3%83%A6%E3%82%A6x%E3%81%BB%E3%82%93%E3%81%93%E3%81%A8%20%23TSZ%E5%9C%A8%E5%BA%AB%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC_%E3%82%B6%E3%83%A6%E3%82%A6x%E3%81%BB%E3%82%93%E3%81%93%E3%81%A8%20https%3A%2F%2Ftimelesz-zaiko-static.pages.dev"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              ポスト（リンク付き）
            </a>
            <a href="https://x.com/intent/tweet?text=%23TSZ%E5%9C%A8%E5%BA%AB%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%20%23TSZ%E5%9C%A8%E5%BA%AB%E6%83%85%E5%A0%B1_%E3%82%B6%E3%83%A6%E3%82%A6%E3%83%8E%E3%83%A1%E3%82%A4%20%23timelesz_%E3%82%B6%E3%83%A6%E3%82%A6x%E3%81%BB%E3%82%93%E3%81%93%E3%81%A8%20%23TSZ%E5%9C%A8%E5%BA%AB%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC_%E3%82%B6%E3%83%A6%E3%82%A6x%E3%81%BB%E3%82%93%E3%81%93%E3%81%A8"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              ポスト（#のみ）
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">店舗在庫を都道府県から探す</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <PrefectureList />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">
            <a href="/onlinestore" className="text-red-600 hover:text-red-700 transition-colors">
              🛒 オンライン予約はこちらから →
            </a>
          </h2>
        </div>
      </div>
      <Sidebar />
    </main>
  );
}

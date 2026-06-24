import type { Metadata } from 'next';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'オンラインで購入はこちらから | timelesz在庫チェッカー',
  description: 'timelesz「消えない花火」のオンライン購入リンクです',
};

const ONLINE_STORES = [
  {
    name: 'UNIVERSAL MUSIC STORE',
    url: 'https://store.universal-music.co.jp/',
    description: 'CD通販',
    note: '※限定版は申し込み終了',
    badge: '限定盤取扱',
    badgeColor: 'bg-blue-500',
    icon: '🎵',
  },
  {
    name: 'Amazon',
    url: 'https://www.amazon.co.jp/s?k=timelesz+%E6%B6%88%E3%81%88%E3%81%AA%E3%81%84%E8%8A%B1%E7%81%AB',
    description: 'CD通販',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '📦',
  },
  {
    name: '楽天ブックス',
    url: 'https://books.rakuten.co.jp/search?sitem=timelesz+%E6%B6%88%E3%81%88%E3%81%AA%E3%81%84%E8%8A%B1%E7%81%AB',
    description: 'CD通販',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '🛍️',
  },
  {
    name: 'HMV&BOOKS online',
    url: 'https://www.hmv.co.jp/search/?target=SEARCH_IN_ALL&keyword=timelesz+%E6%B6%88%E3%81%88%E3%81%AA%E3%81%84%E8%8A%B1%E7%81%AB',
    description: 'CD通販',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '🎶',
  },
  {
    name: 'タワーレコード オンライン',
    url: 'https://tower.jp/search/text/timelesz',
    description: 'CD通販・特典情報あり',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '🗼',
  },
  {
    name: 'セブンネットショッピング',
    url: 'https://7net.omni7.jp/search/?keyword=timelesz+%E6%B6%88%E3%81%88%E3%81%AA%E3%81%84%E8%8A%B1%E7%81%AB',
    description: 'CD通販',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '7️⃣',
  },
  {
    name: 'Yahoo!ショッピング',
    url: 'https://shopping.yahoo.co.jp/search?p=timelesz+%E6%B6%88%E3%81%88%E3%81%AA%E3%81%84%E8%8A%B1%E7%81%AB',
    description: 'CD通販',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '🛒',
  },
];

export default function OnlineStorePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        {/* パンくず */}
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            ホーム
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">オンラインで購入はこちらから</span>
        </nav>

        <div>
          <h1 className="text-2xl font-black text-gray-900">オンラインで購入はこちらから</h1>
          <p className="text-gray-500 text-sm mt-1">
            timelesz「消えない花火」のオンライン購入リンクです
          </p>
        </div>

        {/* ストアリスト */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ONLINE_STORES.map((store) => (
            <a
              key={store.name}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-200 hover:border-emerald-400 rounded-xl p-4 transition-colors group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{store.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {store.name}
                    </h3>
                    {store.badge && (
                      <span className={`${store.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded`}>
                        {store.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{store.description}</p>
                  {store.note && (
                    <p className="text-gray-400 text-xs mt-0.5">{store.note}</p>
                  )}
                </div>
                <span className="text-gray-400 group-hover:text-emerald-600 transition-colors">→</span>
              </div>
            </a>
          ))}
        </div>

        <p className="text-gray-400 text-xs text-center">
          ※リンク先の在庫状況は変動します。購入前に各サイトでご確認ください。
        </p>
      </div>

      <Sidebar />
    </main>
  );
}

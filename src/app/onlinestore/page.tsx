import type { Metadata } from 'next';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'オンライン予約はこちらから | TSZ在庫チェッカー',
  description: 'timelesz「ザユウノメイ / 本当のことを言うと」のオンライン予約リンクです',
};

const ONLINE_STORES = [
  {
    name: 'Amazon',
    url: 'https://timelesz.lnk.to/270203',
    description: 'CD予約・通販',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '📦',
  },
  {
    name: '楽天ブックス',
    url: 'https://rpx.a8.net/svt/ejp?a8mat=4BGJFV+6CMH2Q+2HOM+BW8O1&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0eac8dc2.9a477d4e.0eac8dc3.0aa56a48%2Fa26111281490_4BGJFV_6CMH2Q_2HOM_BW8O1%3Fpc%3Dhttps%253A%252F%252Fbooks.rakuten.co.jp%252Fsearch%253Fsitem%253Dtimelesz%26m%3Dhttps%253A%252F%252Fbooks.rakuten.co.jp%252Fsearch%253Fsitem%253Dtimelesz',
    description: 'CD予約・通販',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '🛍️',
  },
  {
    name: 'HMV&BOOKS online',
    url: 'https://timelesz.lnk.to/270203',
    description: 'CD予約・通販',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '🎶',
  },
  {
    name: 'タワーレコード オンライン',
    url: 'https://timelesz.lnk.to/270203',
    description: 'CD予約・通販・特典情報あり',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '🗼',
  },
  {
    name: 'セブンネットショッピング',
    url: 'https://timelesz.lnk.to/270203',
    description: 'CD予約・通販',
    note: null,
    badge: null,
    badgeColor: '',
    icon: '7️⃣',
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
          <span className="text-gray-700">オンライン予約はこちらから</span>
        </nav>

        <div>
          <h1 className="text-2xl font-black text-gray-900">🛒 オンライン予約はこちらから</h1>
          <p className="text-gray-500 text-sm mt-1">
            timelesz「ザユウノメイ / 本当のことを言うと」（2027.02.03発売）
          </p>
        </div>

        {/* FC会員限定盤 */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">👑</span>
            <h2 className="text-base font-black text-amber-900">ファンクラブ会員限定盤</h2>
            <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded">受注生産限定</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
            <div className="bg-white rounded-lg px-4 py-3 border border-amber-200">
              <p className="font-bold text-gray-800">[CD＋Blu-ray]</p>
              <p className="text-gray-500 text-xs mt-0.5">PROS-5056 / ¥1,800（税込）</p>
            </div>
            <div className="bg-white rounded-lg px-4 py-3 border border-amber-200">
              <p className="font-bold text-gray-800">[CD＋DVD]</p>
              <p className="text-gray-500 text-xs mt-0.5">PROS-5057 / ¥1,800（税込）</p>
            </div>
          </div>

          <div className="bg-white rounded-lg px-4 py-2 mb-4 border border-amber-200 text-center">
            <p className="text-red-600 font-bold text-sm">
              予約期間：2026年11月9日(月)20:00〜12月21日(月)23:59まで
            </p>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            ※本商品はtimeleszファンクラブ会員様のみ購入可能な限定商品です。一般の音楽ソフト取扱店、ECサイト店での取り扱いはございません。ご注意ください。
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://ovtp.jp/9117529"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm text-center px-4 py-3 rounded-xl transition-colors"
            >
              [CD＋Blu-ray] の予約はコチラ！
            </a>
            <a
              href="https://ovtp.jp/9117529"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm text-center px-4 py-3 rounded-xl transition-colors"
            >
              [CD＋DVD] の予約はコチラ！
            </a>
          </div>
        </div>

        {/* 一般予約 */}
        <div>
          <h2 className="text-base font-black text-gray-900 mb-3">📀 一般予約・購入</h2>
          <div className="mb-3">
            <a
              href="https://timelesz.lnk.to/270203"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-5 py-3 rounded-xl transition-colors"
            >
              🎵 各ストアの予約ページへ（一覧）
            </a>
          </div>
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
        </div>

        <p className="text-gray-400 text-xs text-center">
          ※リンク先の在庫・予約状況は変動します。購入前に各サイトでご確認ください。
        </p>
        {/* A8.net 楽天アフィリエイト トラッキングピクセル */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* @ts-expect-error border is a valid HTML attribute */}
        <img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=4BGJFV+6CMH2Q+2HOM+BW8O1" alt="" />
      </div>

      <Sidebar />
    </main>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'timelesz在庫チェッカー',
  description:
    '【ファンサイト】timelesz「消えない花火」の全国CDショップ在庫状況をファン同士で更新・共有できます。',
  keywords: 'timelesz,在庫チェッカー,CD在庫,消えない花火',
  themeColor: '#ffffff',
  openGraph: {
    title: 'timelesz在庫チェッカー',
    description:
      '【ファンサイト】timelesz「消えない花火」の全国CDショップ在庫状況をファン同士で更新・共有できます。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'timelesz在庫チェッカー',
    description:
      '【ファンサイト】timelesz「消えない花火」の全国CDショップ在庫状況をファン同士で更新・共有できます。',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {/* ヘッダー */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-gray-900">
                timelesz<span className="text-emerald-600">在庫チェッカー</span>
              </span>
            </a>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="hidden sm:block">※ファンサイト（unofficial）</span>
              <a
                href="/onlinestore"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                オンライン購入
              </a>
            </div>
          </div>
        </header>

        {children}

        {/* フッター */}
        <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500 bg-white">
          <p>timelesz在庫チェッカー — ファンサイト（unofficial）</p>
        </footer>
      </body>
    </html>
  );
}

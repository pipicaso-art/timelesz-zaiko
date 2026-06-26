import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPrefectureByCode } from '@/data/prefectures';
import { Sidebar } from '@/components/Sidebar';
import { StoreList } from './StoreList';

interface Props {
  params: Promise<{ prefecture: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prefecture } = await params;
  const pref = getPrefectureByCode(prefecture);
  if (!pref) return {};
  return {
    title: `${pref.name}の在庫 | timelesz在庫チェッカー`,
    description: `timelesz「消えない花火」の${pref.name}のCDショップ在庫状況`,
  };
}

export default async function PrefecturePage({ params }: Props) {
  const { prefecture } = await params;
  const pref = getPrefectureByCode(prefecture);

  if (!pref) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        {/* パンくず */}
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            ホーム
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{pref.name}</span>
        </nav>

        {/* タイトル */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {pref.name}の在庫
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            timelesz「消えない花火」の店舗在庫情報を確認・更新できます
          </p>
        </div>

        {/* 更新ボタン説明 */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
          <strong>在庫情報を確認したら「更新」ボタンを押して教えてください！</strong>
          <br />
          みんなで在庫情報を共有しましょう ✨
        </div>

        {/* 店舗リスト */}
        <StoreList prefectureCode={pref.code} />
      </div>
      <Sidebar />
    </main>
  );
}

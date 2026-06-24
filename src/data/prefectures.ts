import type { Prefecture } from '@/types';

export const REGIONS = [
  '北海道・東北',
  '関東',
  '中部',
  '関西',
  '中国',
  '四国',
  '九州・沖縄',
] as const;

export const PREFECTURES: Prefecture[] = [
  // 北海道・東北
  { name: '北海道', code: 'hokkaido', region: '北海道・東北' },
  { name: '青森県', code: 'aomori', region: '北海道・東北' },
  { name: '岩手県', code: 'iwate', region: '北海道・東北' },
  { name: '宮城県', code: 'miyagi', region: '北海道・東北' },
  { name: '秋田県', code: 'akita', region: '北海道・東北' },
  { name: '山形県', code: 'yamagata', region: '北海道・東北' },
  { name: '福島県', code: 'fukushima', region: '北海道・東北' },
  // 関東
  { name: '茨城県', code: 'ibaraki', region: '関東' },
  { name: '栃木県', code: 'tochigi', region: '関東' },
  { name: '群馬県', code: 'gunma', region: '関東' },
  { name: '埼玉県', code: 'saitama', region: '関東' },
  { name: '千葉県', code: 'chiba', region: '関東' },
  { name: '東京都', code: 'tokyo', region: '関東' },
  { name: '神奈川県', code: 'kanagawa', region: '関東' },
  // 中部
  { name: '新潟県', code: 'niigata', region: '中部' },
  { name: '富山県', code: 'toyama', region: '中部' },
  { name: '石川県', code: 'ishikawa', region: '中部' },
  { name: '福井県', code: 'fukui', region: '中部' },
  { name: '山梨県', code: 'yamanashi', region: '中部' },
  { name: '長野県', code: 'nagano', region: '中部' },
  { name: '岐阜県', code: 'gifu', region: '中部' },
  { name: '静岡県', code: 'shizuoka', region: '中部' },
  { name: '愛知県', code: 'aichi', region: '中部' },
  // 関西
  { name: '三重県', code: 'mie', region: '関西' },
  { name: '滋賀県', code: 'shiga', region: '関西' },
  { name: '京都府', code: 'kyoto', region: '関西' },
  { name: '大阪府', code: 'osaka', region: '関西' },
  { name: '兵庫県', code: 'hyogo', region: '関西' },
  { name: '奈良県', code: 'nara', region: '関西' },
  { name: '和歌山県', code: 'wakayama', region: '関西' },
  // 中国
  { name: '鳥取県', code: 'tottori', region: '中国' },
  { name: '島根県', code: 'shimane', region: '中国' },
  { name: '岡山県', code: 'okayama', region: '中国' },
  { name: '広島県', code: 'hiroshima', region: '中国' },
  { name: '山口県', code: 'yamaguchi', region: '中国' },
  // 四国
  { name: '徳島県', code: 'tokushima', region: '四国' },
  { name: '香川県', code: 'kagawa', region: '四国' },
  { name: '愛媛県', code: 'ehime', region: '四国' },
  { name: '高知県', code: 'kochi', region: '四国' },
  // 九州・沖縄
  { name: '福岡県', code: 'fukuoka', region: '九州・沖縄' },
  { name: '佐賀県', code: 'saga', region: '九州・沖縄' },
  { name: '長崎県', code: 'nagasaki', region: '九州・沖縄' },
  { name: '熊本県', code: 'kumamoto', region: '九州・沖縄' },
  { name: '大分県', code: 'oita', region: '九州・沖縄' },
  { name: '宮崎県', code: 'miyazaki', region: '九州・沖縄' },
  { name: '鹿児島県', code: 'kagoshima', region: '九州・沖縄' },
  { name: '沖縄県', code: 'okinawa', region: '九州・沖縄' },
];

export const PREFECTURES_BY_REGION = REGIONS.reduce(
  (acc, region) => {
    acc[region] = PREFECTURES.filter((p) => p.region === region);
    return acc;
  },
  {} as Record<string, Prefecture[]>
);

export function getPrefectureByCode(code: string): Prefecture | undefined {
  return PREFECTURES.find((p) => p.code === code);
}

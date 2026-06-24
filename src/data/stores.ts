// 全国主要CDショップリスト（timelesz CD取扱い店舗）
// 実際の店舗はsupabaseのstoresテーブルで管理します
// このファイルはシードデータとして使用されます

export interface StoreData {
  name: string;
  prefecture: string;
  prefecture_code: string;
  address?: string;
}

export const STORE_DATA: StoreData[] = [
  // ===== 北海道 =====
  { name: 'タワーレコード 札幌ピヴォ店', prefecture: '北海道', prefecture_code: 'hokkaido', address: '札幌市中央区' },
  { name: 'HMV&BOOKS SAPPORO', prefecture: '北海道', prefecture_code: 'hokkaido', address: '札幌市中央区' },
  { name: 'TSUTAYA 札幌駅前通り店', prefecture: '北海道', prefecture_code: 'hokkaido', address: '札幌市中央区' },
  { name: 'アニメイト札幌店', prefecture: '北海道', prefecture_code: 'hokkaido', address: '札幌市中央区' },
  { name: 'ヴィレッジヴァンガード札幌パルコ店', prefecture: '北海道', prefecture_code: 'hokkaido', address: '札幌市中央区' },
  { name: 'TSUTAYA 旭川永山店', prefecture: '北海道', prefecture_code: 'hokkaido', address: '旭川市' },
  { name: 'TSUTAYA 函館昭和店', prefecture: '北海道', prefecture_code: 'hokkaido', address: '函館市' },

  // ===== 青森県 =====
  { name: 'TSUTAYA 青森中央店', prefecture: '青森県', prefecture_code: 'aomori', address: '青森市' },
  { name: 'アニメイト青森店', prefecture: '青森県', prefecture_code: 'aomori', address: '青森市' },
  { name: 'TSUTAYA 弘前城東店', prefecture: '青森県', prefecture_code: 'aomori', address: '弘前市' },

  // ===== 岩手県 =====
  { name: 'タワーレコード 盛岡フェザン店', prefecture: '岩手県', prefecture_code: 'iwate', address: '盛岡市' },
  { name: 'TSUTAYA 盛岡南店', prefecture: '岩手県', prefecture_code: 'iwate', address: '盛岡市' },
  { name: 'アニメイト盛岡店', prefecture: '岩手県', prefecture_code: 'iwate', address: '盛岡市' },

  // ===== 宮城県 =====
  { name: 'タワーレコード 仙台パルコ店', prefecture: '宮城県', prefecture_code: 'miyagi', address: '仙台市青葉区' },
  { name: 'HMV仙台', prefecture: '宮城県', prefecture_code: 'miyagi', address: '仙台市青葉区' },
  { name: 'アニメイト仙台店', prefecture: '宮城県', prefecture_code: 'miyagi', address: '仙台市青葉区' },
  { name: 'TSUTAYA 仙台泉中央店', prefecture: '宮城県', prefecture_code: 'miyagi', address: '仙台市泉区' },
  { name: 'エンターキング 仙台本町店', prefecture: '宮城県', prefecture_code: 'miyagi', address: '仙台市青葉区' },

  // ===== 秋田県 =====
  { name: 'TSUTAYA 秋田広面店', prefecture: '秋田県', prefecture_code: 'akita', address: '秋田市' },
  { name: 'アニメイト秋田店', prefecture: '秋田県', prefecture_code: 'akita', address: '秋田市' },

  // ===== 山形県 =====
  { name: 'TSUTAYA 山形南館店', prefecture: '山形県', prefecture_code: 'yamagata', address: '山形市' },
  { name: 'アニメイト山形店', prefecture: '山形県', prefecture_code: 'yamagata', address: '山形市' },

  // ===== 福島県 =====
  { name: 'タワーレコード 郡山店', prefecture: '福島県', prefecture_code: 'fukushima', address: '郡山市' },
  { name: 'TSUTAYA 福島西口店', prefecture: '福島県', prefecture_code: 'fukushima', address: '福島市' },
  { name: 'アニメイト福島店', prefecture: '福島県', prefecture_code: 'fukushima', address: '福島市' },

  // ===== 茨城県 =====
  { name: 'タワーレコード イーアスつくば店', prefecture: '茨城県', prefecture_code: 'ibaraki', address: 'つくば市' },
  { name: 'HMV水戸', prefecture: '茨城県', prefecture_code: 'ibaraki', address: '水戸市' },
  { name: 'TSUTAYA 水戸南店', prefecture: '茨城県', prefecture_code: 'ibaraki', address: '水戸市' },
  { name: 'アニメイト水戸店', prefecture: '茨城県', prefecture_code: 'ibaraki', address: '水戸市' },

  // ===== 栃木県 =====
  { name: 'タワーレコード 宇都宮店', prefecture: '栃木県', prefecture_code: 'tochigi', address: '宇都宮市' },
  { name: 'TSUTAYA 宇都宮店', prefecture: '栃木県', prefecture_code: 'tochigi', address: '宇都宮市' },
  { name: 'アニメイト宇都宮店', prefecture: '栃木県', prefecture_code: 'tochigi', address: '宇都宮市' },

  // ===== 群馬県 =====
  { name: 'タワーレコード 高崎オーパ店', prefecture: '群馬県', prefecture_code: 'gunma', address: '高崎市' },
  { name: 'TSUTAYA 前橋みなみモール店', prefecture: '群馬県', prefecture_code: 'gunma', address: '前橋市' },
  { name: 'アニメイト高崎店', prefecture: '群馬県', prefecture_code: 'gunma', address: '高崎市' },

  // ===== 埼玉県 =====
  { name: 'タワーレコード 大宮店', prefecture: '埼玉県', prefecture_code: 'saitama', address: 'さいたま市大宮区' },
  { name: 'HMV&BOOKS SHINJUKU（大宮）', prefecture: '埼玉県', prefecture_code: 'saitama', address: 'さいたま市大宮区' },
  { name: 'アニメイト大宮店', prefecture: '埼玉県', prefecture_code: 'saitama', address: 'さいたま市大宮区' },
  { name: 'タワーレコード 川越店', prefecture: '埼玉県', prefecture_code: 'saitama', address: '川越市' },
  { name: 'TSUTAYA 浦和店', prefecture: '埼玉県', prefecture_code: 'saitama', address: 'さいたま市浦和区' },
  { name: 'アニメイト所沢店', prefecture: '埼玉県', prefecture_code: 'saitama', address: '所沢市' },

  // ===== 千葉県 =====
  { name: 'タワーレコード 柏店', prefecture: '千葉県', prefecture_code: 'chiba', address: '柏市' },
  { name: 'タワーレコード 津田沼店', prefecture: '千葉県', prefecture_code: 'chiba', address: '習志野市' },
  { name: 'HMV 津田沼パルコ', prefecture: '千葉県', prefecture_code: 'chiba', address: '習志野市' },
  { name: 'アニメイト千葉店', prefecture: '千葉県', prefecture_code: 'chiba', address: '千葉市中央区' },
  { name: 'TSUTAYA 幕張新都心店', prefecture: '千葉県', prefecture_code: 'chiba', address: '千葉市花見川区' },
  { name: 'アニメイト柏店', prefecture: '千葉県', prefecture_code: 'chiba', address: '柏市' },

  // ===== 東京都 =====
  { name: 'タワーレコード 渋谷店', prefecture: '東京都', prefecture_code: 'tokyo', address: '渋谷区神南1-22-14' },
  { name: 'タワーレコード 新宿店', prefecture: '東京都', prefecture_code: 'tokyo', address: '新宿区新宿3-37-12' },
  { name: 'タワーレコード 池袋店', prefecture: '東京都', prefecture_code: 'tokyo', address: '豊島区東池袋3-1-1' },
  { name: 'タワーレコード 吉祥寺店', prefecture: '東京都', prefecture_code: 'tokyo', address: '武蔵野市吉祥寺本町1-5-1' },
  { name: 'タワーレコード 秋葉原店', prefecture: '東京都', prefecture_code: 'tokyo', address: '千代田区外神田4-3-3' },
  { name: 'タワーレコード 町田店', prefecture: '東京都', prefecture_code: 'tokyo', address: '町田市原町田6-5-11' },
  { name: 'HMV&BOOKS SHIBUYA', prefecture: '東京都', prefecture_code: 'tokyo', address: '渋谷区宇田川町24-1' },
  { name: 'HMV エソラ池袋', prefecture: '東京都', prefecture_code: 'tokyo', address: '豊島区西池袋1-12-1' },
  { name: 'HMV 立川', prefecture: '東京都', prefecture_code: 'tokyo', address: '立川市柴崎町3-2-1' },
  { name: 'SHIBUYA TSUTAYA', prefecture: '東京都', prefecture_code: 'tokyo', address: '渋谷区宇田川町21-6' },
  { name: 'アニメイト池袋本店', prefecture: '東京都', prefecture_code: 'tokyo', address: '豊島区東池袋1-21-7' },
  { name: 'アニメイト秋葉原本館店', prefecture: '東京都', prefecture_code: 'tokyo', address: '千代田区外神田1-8-3' },
  { name: 'アニメイト吉祥寺パルコ店', prefecture: '東京都', prefecture_code: 'tokyo', address: '武蔵野市吉祥寺本町1-5-1' },
  { name: 'アニメイト新宿ハルク店', prefecture: '東京都', prefecture_code: 'tokyo', address: '新宿区西新宿1-1-3' },
  { name: '山野楽器 銀座本店', prefecture: '東京都', prefecture_code: 'tokyo', address: '中央区銀座7-9-12' },
  { name: '紀伊國屋書店 新宿本店', prefecture: '東京都', prefecture_code: 'tokyo', address: '新宿区新宿3-17-7' },
  { name: '銀座 蔦屋書店', prefecture: '東京都', prefecture_code: 'tokyo', address: '中央区銀座6-10-1' },
  { name: '代官山 蔦屋書店', prefecture: '東京都', prefecture_code: 'tokyo', address: '渋谷区猿楽町17-5' },
  { name: 'TOWER RECORDS mini ダイバーシティ東京プラザ店', prefecture: '東京都', prefecture_code: 'tokyo', address: '江東区青海1-1-10' },

  // ===== 神奈川県 =====
  { name: 'タワーレコード 横浜店', prefecture: '神奈川県', prefecture_code: 'kanagawa', address: '横浜市西区' },
  { name: 'タワーレコード 川崎店', prefecture: '神奈川県', prefecture_code: 'kanagawa', address: '川崎市川崎区' },
  { name: 'HMV&BOOKS YOKOHAMA', prefecture: '神奈川県', prefecture_code: 'kanagawa', address: '横浜市西区' },
  { name: 'アニメイト横浜店', prefecture: '神奈川県', prefecture_code: 'kanagawa', address: '横浜市西区' },
  { name: 'アニメイト川崎店', prefecture: '神奈川県', prefecture_code: 'kanagawa', address: '川崎市川崎区' },
  { name: 'TSUTAYA 横浜みなとみらい店', prefecture: '神奈川県', prefecture_code: 'kanagawa', address: '横浜市西区' },

  // ===== 新潟県 =====
  { name: 'タワーレコード 新潟店', prefecture: '新潟県', prefecture_code: 'niigata', address: '新潟市中央区' },
  { name: 'アニメイト新潟店', prefecture: '新潟県', prefecture_code: 'niigata', address: '新潟市中央区' },
  { name: 'TSUTAYA 新潟紫竹山店', prefecture: '新潟県', prefecture_code: 'niigata', address: '新潟市中央区' },

  // ===== 富山県 =====
  { name: 'TSUTAYA 富山豊田店', prefecture: '富山県', prefecture_code: 'toyama', address: '富山市' },
  { name: 'アニメイト富山店', prefecture: '富山県', prefecture_code: 'toyama', address: '富山市' },

  // ===== 石川県 =====
  { name: 'タワーレコード 金沢フォーラス店', prefecture: '石川県', prefecture_code: 'ishikawa', address: '金沢市' },
  { name: 'アニメイト金沢店', prefecture: '石川県', prefecture_code: 'ishikawa', address: '金沢市' },
  { name: 'TSUTAYA 野々市店', prefecture: '石川県', prefecture_code: 'ishikawa', address: '野々市市' },

  // ===== 福井県 =====
  { name: 'TSUTAYA 福井店', prefecture: '福井県', prefecture_code: 'fukui', address: '福井市' },

  // ===== 山梨県 =====
  { name: 'TSUTAYA 甲府上石田店', prefecture: '山梨県', prefecture_code: 'yamanashi', address: '甲府市' },

  // ===== 長野県 =====
  { name: 'タワーレコード 長野店', prefecture: '長野県', prefecture_code: 'nagano', address: '長野市' },
  { name: 'TSUTAYA 松本筑摩店', prefecture: '長野県', prefecture_code: 'nagano', address: '松本市' },
  { name: 'アニメイト長野店', prefecture: '長野県', prefecture_code: 'nagano', address: '長野市' },

  // ===== 岐阜県 =====
  { name: 'TSUTAYA 岐阜則武店', prefecture: '岐阜県', prefecture_code: 'gifu', address: '岐阜市' },
  { name: 'アニメイト岐阜店', prefecture: '岐阜県', prefecture_code: 'gifu', address: '岐阜市' },

  // ===== 静岡県 =====
  { name: 'タワーレコード 静岡店', prefecture: '静岡県', prefecture_code: 'shizuoka', address: '静岡市葵区' },
  { name: 'TSUTAYA 浜松市野店', prefecture: '静岡県', prefecture_code: 'shizuoka', address: '浜松市中区' },
  { name: 'アニメイト静岡店', prefecture: '静岡県', prefecture_code: 'shizuoka', address: '静岡市葵区' },
  { name: 'アニメイト浜松店', prefecture: '静岡県', prefecture_code: 'shizuoka', address: '浜松市中区' },

  // ===== 愛知県 =====
  { name: 'タワーレコード 名古屋パルコ店', prefecture: '愛知県', prefecture_code: 'aichi', address: '名古屋市中区' },
  { name: 'タワーレコード 名古屋近鉄パッセ店', prefecture: '愛知県', prefecture_code: 'aichi', address: '名古屋市中村区' },
  { name: 'HMV&BOOKS NAGOYA', prefecture: '愛知県', prefecture_code: 'aichi', address: '名古屋市中区' },
  { name: 'アニメイト名古屋店', prefecture: '愛知県', prefecture_code: 'aichi', address: '名古屋市中区' },
  { name: 'TSUTAYA 名古屋川名店', prefecture: '愛知県', prefecture_code: 'aichi', address: '名古屋市昭和区' },
  { name: 'アニメイト栄店', prefecture: '愛知県', prefecture_code: 'aichi', address: '名古屋市中区' },

  // ===== 三重県 =====
  { name: 'TSUTAYA 津垂水店', prefecture: '三重県', prefecture_code: 'mie', address: '津市' },
  { name: 'アニメイト四日市店', prefecture: '三重県', prefecture_code: 'mie', address: '四日市市' },

  // ===== 滋賀県 =====
  { name: 'タワーレコード 草津店', prefecture: '滋賀県', prefecture_code: 'shiga', address: '草津市' },
  { name: 'TSUTAYA 草津野路店', prefecture: '滋賀県', prefecture_code: 'shiga', address: '草津市' },

  // ===== 京都府 =====
  { name: 'タワーレコード 京都店', prefecture: '京都府', prefecture_code: 'kyoto', address: '京都市下京区' },
  { name: 'HMV京都', prefecture: '京都府', prefecture_code: 'kyoto', address: '京都市下京区' },
  { name: 'アニメイト京都店', prefecture: '京都府', prefecture_code: 'kyoto', address: '京都市中京区' },
  { name: 'TSUTAYA 京都木津川店', prefecture: '京都府', prefecture_code: 'kyoto', address: '木津川市' },

  // ===== 大阪府 =====
  { name: 'タワーレコード 梅田NU茶屋町店', prefecture: '大阪府', prefecture_code: 'osaka', address: '大阪市北区' },
  { name: 'タワーレコード なんば店', prefecture: '大阪府', prefecture_code: 'osaka', address: '大阪市中央区' },
  { name: 'HMV&BOOKS OSAKA SHINSAIBASHI', prefecture: '大阪府', prefecture_code: 'osaka', address: '大阪市中央区' },
  { name: 'アニメイト大阪日本橋店', prefecture: '大阪府', prefecture_code: 'osaka', address: '大阪市浪速区' },
  { name: 'アニメイト梅田店', prefecture: '大阪府', prefecture_code: 'osaka', address: '大阪市北区' },
  { name: 'TSUTAYA EBISUBASHI', prefecture: '大阪府', prefecture_code: 'osaka', address: '大阪市中央区' },
  { name: 'タワーレコード 天王寺MIO店', prefecture: '大阪府', prefecture_code: 'osaka', address: '大阪市天王寺区' },
  { name: 'HMV イオンモール大阪ドームシティ', prefecture: '大阪府', prefecture_code: 'osaka', address: '大阪市西区' },

  // ===== 兵庫県 =====
  { name: 'タワーレコード 神戸店', prefecture: '兵庫県', prefecture_code: 'hyogo', address: '神戸市中央区' },
  { name: 'HMV 神戸', prefecture: '兵庫県', prefecture_code: 'hyogo', address: '神戸市中央区' },
  { name: 'アニメイト神戸店', prefecture: '兵庫県', prefecture_code: 'hyogo', address: '神戸市中央区' },
  { name: 'TSUTAYA 三田ウッディタウン店', prefecture: '兵庫県', prefecture_code: 'hyogo', address: '三田市' },

  // ===== 奈良県 =====
  { name: 'TSUTAYA 奈良学園前店', prefecture: '奈良県', prefecture_code: 'nara', address: '奈良市' },
  { name: 'アニメイト奈良店', prefecture: '奈良県', prefecture_code: 'nara', address: '奈良市' },

  // ===== 和歌山県 =====
  { name: 'TSUTAYA 和歌山北インター店', prefecture: '和歌山県', prefecture_code: 'wakayama', address: '和歌山市' },

  // ===== 鳥取県 =====
  { name: 'TSUTAYA 鳥取南店', prefecture: '鳥取県', prefecture_code: 'tottori', address: '鳥取市' },

  // ===== 島根県 =====
  { name: 'TSUTAYA 出雲店', prefecture: '島根県', prefecture_code: 'shimane', address: '出雲市' },

  // ===== 岡山県 =====
  { name: 'タワーレコード 岡山店', prefecture: '岡山県', prefecture_code: 'okayama', address: '岡山市北区' },
  { name: 'アニメイト岡山店', prefecture: '岡山県', prefecture_code: 'okayama', address: '岡山市北区' },
  { name: 'TSUTAYA 岡山桑野店', prefecture: '岡山県', prefecture_code: 'okayama', address: '岡山市北区' },

  // ===== 広島県 =====
  { name: 'タワーレコード 広島店', prefecture: '広島県', prefecture_code: 'hiroshima', address: '広島市中区' },
  { name: 'HMV 広島', prefecture: '広島県', prefecture_code: 'hiroshima', address: '広島市中区' },
  { name: 'アニメイト広島店', prefecture: '広島県', prefecture_code: 'hiroshima', address: '広島市中区' },
  { name: 'TSUTAYA 広島府中店', prefecture: '広島県', prefecture_code: 'hiroshima', address: '広島市安佐南区' },

  // ===== 山口県 =====
  { name: 'TSUTAYA 山口店', prefecture: '山口県', prefecture_code: 'yamaguchi', address: '山口市' },
  { name: 'アニメイト山口店', prefecture: '山口県', prefecture_code: 'yamaguchi', address: '山口市' },

  // ===== 徳島県 =====
  { name: 'TSUTAYA 徳島八万店', prefecture: '徳島県', prefecture_code: 'tokushima', address: '徳島市' },

  // ===== 香川県 =====
  { name: 'タワーレコード 高松オーパ店', prefecture: '香川県', prefecture_code: 'kagawa', address: '高松市' },
  { name: 'アニメイト高松店', prefecture: '香川県', prefecture_code: 'kagawa', address: '高松市' },
  { name: 'TSUTAYA 高松東山崎店', prefecture: '香川県', prefecture_code: 'kagawa', address: '高松市' },

  // ===== 愛媛県 =====
  { name: 'タワーレコード 松山店', prefecture: '愛媛県', prefecture_code: 'ehime', address: '松山市' },
  { name: 'アニメイト松山店', prefecture: '愛媛県', prefecture_code: 'ehime', address: '松山市' },
  { name: 'TSUTAYA 松山久米店', prefecture: '愛媛県', prefecture_code: 'ehime', address: '松山市' },

  // ===== 高知県 =====
  { name: 'TSUTAYA 高知南店', prefecture: '高知県', prefecture_code: 'kochi', address: '高知市' },

  // ===== 福岡県 =====
  { name: 'タワーレコード 福岡パルコ店', prefecture: '福岡県', prefecture_code: 'fukuoka', address: '福岡市中央区' },
  { name: 'HMV&BOOKS HAKATA', prefecture: '福岡県', prefecture_code: 'fukuoka', address: '福岡市博多区' },
  { name: 'アニメイト福岡パルコ店', prefecture: '福岡県', prefecture_code: 'fukuoka', address: '福岡市中央区' },
  { name: 'タワーレコード ゆめタウン博多店', prefecture: '福岡県', prefecture_code: 'fukuoka', address: '福岡市博多区' },
  { name: 'TSUTAYA 福岡天神店', prefecture: '福岡県', prefecture_code: 'fukuoka', address: '福岡市中央区' },
  { name: 'アニメイト天神店', prefecture: '福岡県', prefecture_code: 'fukuoka', address: '福岡市中央区' },

  // ===== 佐賀県 =====
  { name: 'TSUTAYA 佐賀大財店', prefecture: '佐賀県', prefecture_code: 'saga', address: '佐賀市' },

  // ===== 長崎県 =====
  { name: 'TSUTAYA 長崎銅座店', prefecture: '長崎県', prefecture_code: 'nagasaki', address: '長崎市' },
  { name: 'アニメイト長崎店', prefecture: '長崎県', prefecture_code: 'nagasaki', address: '長崎市' },

  // ===== 熊本県 =====
  { name: 'タワーレコード 熊本店', prefecture: '熊本県', prefecture_code: 'kumamoto', address: '熊本市中央区' },
  { name: 'アニメイト熊本店', prefecture: '熊本県', prefecture_code: 'kumamoto', address: '熊本市中央区' },
  { name: 'TSUTAYA 熊本光の森店', prefecture: '熊本県', prefecture_code: 'kumamoto', address: '菊池郡' },

  // ===== 大分県 =====
  { name: 'TSUTAYA 大分わさだ店', prefecture: '大分県', prefecture_code: 'oita', address: '大分市' },
  { name: 'アニメイト大分店', prefecture: '大分県', prefecture_code: 'oita', address: '大分市' },

  // ===== 宮崎県 =====
  { name: 'TSUTAYA 宮崎高千穂通り店', prefecture: '宮崎県', prefecture_code: 'miyazaki', address: '宮崎市' },

  // ===== 鹿児島県 =====
  { name: 'タワーレコード 鹿児島店', prefecture: '鹿児島県', prefecture_code: 'kagoshima', address: '鹿児島市' },
  { name: 'アニメイト鹿児島店', prefecture: '鹿児島県', prefecture_code: 'kagoshima', address: '鹿児島市' },
  { name: 'TSUTAYA 鹿児島新栄店', prefecture: '鹿児島県', prefecture_code: 'kagoshima', address: '鹿児島市' },

  // ===== 沖縄県 =====
  { name: 'タワーレコード 那覇リウボウ店', prefecture: '沖縄県', prefecture_code: 'okinawa', address: '那覇市' },
  { name: 'TSUTAYA 小禄店', prefecture: '沖縄県', prefecture_code: 'okinawa', address: '那覇市' },
  { name: 'アニメイト那覇店', prefecture: '沖縄県', prefecture_code: 'okinawa', address: '那覇市' },
];

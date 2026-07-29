/**
 * 住所が未登録の店舗に住所を取得してSupabaseに保存するスクリプト
 *
 * 実行方法:
 *   node scripts/fetch-addresses.mjs
 *
 * 処理:
 *   - 座標あり・住所なし → 逆ジオコーディング（lat/lon → 住所）
 *   - 座標なし・住所なし → 前方ジオコーディング（店舗名 → lat/lon + 住所）
 *
 * Nominatim利用規約: 1リクエスト/秒のレート制限あり
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mxplxvthjtxbxehigpki.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const HEADERS = { 'User-Agent': 'timelesz-zaiko-checker/1.0 (fan site)' };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Nominatimの構造化住所から日本語住所を生成 */
function formatJapaneseAddress(addr) {
  if (!addr) return null;
  const parts = [
    addr.state,                                                          // 都道府県
    addr.county || addr.city || addr.town || addr.municipality,         // 市区町村
    addr.suburb || addr.neighbourhood || addr.quarter || addr.village,  // 町・丁目
    addr.road,                                                           // 通り・番地
    addr.house_number,                                                   // 号
  ].filter(Boolean);
  return parts.length > 0 ? parts.join('') : null;
}

/** 逆ジオコーディング: lat/lon → 住所 */
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ja&zoom=18&addressdetails=1`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) return null;
  return formatJapaneseAddress(data.address);
}

/** 前方ジオコーディング: 店舗名 → lat/lon + 住所 */
async function forwardGeocode(store) {
  const queries = [
    `${store.name} ${store.prefecture} 日本`,
    `${store.name} 日本`,
  ];

  for (let i = 0; i < queries.length; i++) {
    if (i > 0) await sleep(1100);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queries[i])}&format=json&limit=1&accept-language=ja&countrycodes=jp&addressdetails=1`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const results = await res.json();
    if (results.length > 0) {
      const r = results[0];
      return {
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        address: formatJapaneseAddress(r.address),
      };
    }
  }
  return null;
}

async function main() {
  console.log('Supabaseから住所未登録の店舗を取得中...');

  const { data: stores, error } = await supabase
    .from('stores')
    .select('id, name, prefecture, latitude, longitude, address')
    .or('address.is.null,address.eq.')
    .order('prefecture_code');

  if (error) {
    console.error('取得エラー:', error.message);
    process.exit(1);
  }

  const withCoords = stores.filter((s) => s.latitude && s.longitude);
  const withoutCoords = stores.filter((s) => !s.latitude || !s.longitude);

  console.log(`住所未登録: ${stores.length}件`);
  console.log(`  座標あり（逆ジオコーディング）: ${withCoords.length}件`);
  console.log(`  座標なし（前方ジオコーディング）: ${withoutCoords.length}件\n`);

  let success = 0;
  let fail = 0;
  let total = 0;

  // === 逆ジオコーディング（座標あり → 住所取得）===
  for (let i = 0; i < withCoords.length; i++) {
    const store = withCoords[i];
    total++;
    console.log(`[逆 ${i + 1}/${withCoords.length}] ${store.name}...`);

    try {
      const address = await reverseGeocode(store.latitude, store.longitude);
      if (address) {
        const { error: updateError } = await supabase
          .from('stores')
          .update({ address })
          .eq('id', store.id);

        if (updateError) {
          console.error(`  更新エラー: ${updateError.message}`);
          fail++;
        } else {
          console.log(`  ✓ ${address}`);
          success++;
        }
      } else {
        console.log(`  ✗ 住所取得失敗`);
        fail++;
      }
    } catch (e) {
      console.error(`  エラー: ${e.message}`);
      fail++;
    }

    if (i < withCoords.length - 1) await sleep(1100);
  }

  // === 前方ジオコーディング（座標なし → lat/lon + 住所）===
  if (withCoords.length > 0 && withoutCoords.length > 0) {
    await sleep(1100); // 前のリクエストとの間隔
  }

  for (let i = 0; i < withoutCoords.length; i++) {
    const store = withoutCoords[i];
    total++;
    console.log(`[前方 ${i + 1}/${withoutCoords.length}] ${store.name}...`);

    try {
      const result = await forwardGeocode(store);
      if (result) {
        const update = {
          latitude: result.latitude,
          longitude: result.longitude,
          ...(result.address ? { address: result.address } : {}),
        };

        const { error: updateError } = await supabase
          .from('stores')
          .update(update)
          .eq('id', store.id);

        if (updateError) {
          console.error(`  更新エラー: ${updateError.message}`);
          fail++;
        } else {
          console.log(`  ✓ ${result.address || '（住所なし）'} (${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)})`);
          success++;
        }
      } else {
        console.log(`  ✗ 取得失敗`);
        fail++;
      }
    } catch (e) {
      console.error(`  エラー: ${e.message}`);
      fail++;
    }

    if (i < withoutCoords.length - 1) await sleep(1100);
  }

  console.log(`\n完了: 成功 ${success}件 / 失敗 ${fail}件 / 合計 ${total}件`);
}

main();

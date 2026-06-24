/**
 * 店舗住所から緯度・経度を取得してSupabaseに保存するスクリプト
 *
 * 実行前に:
 * 1. supabase/add_coordinates.sql を Supabase SQL Editor で実行
 * 2. node scripts/geocode-stores.mjs を実行
 *
 * Nominatim利用規約: 1リクエスト/秒のレート制限あり
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mxplxvthjtxbxehigpki.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocodeStore(store) {
  const headers = { 'User-Agent': 'timelesz-zaiko-checker/1.0 (fan site)' };

  async function trySearch(q) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=ja&countrycodes=jp`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const results = await res.json();
    return results.length > 0
      ? { latitude: parseFloat(results[0].lat), longitude: parseFloat(results[0].lon) }
      : null;
  }

  // 検索候補を優先順に試みる
  const queries = [
    // 住所あり: 店舗名 + 住所
    store.address ? `${store.name} ${store.address} 日本` : null,
    // 店舗名 + 都道府県
    `${store.name} ${store.prefecture} 日本`,
    // 店舗名のみ
    `${store.name} 日本`,
  ].filter(Boolean);

  for (let i = 0; i < queries.length; i++) {
    if (i > 0) await sleep(1100); // レート制限
    const result = await trySearch(queries[i]);
    if (result) return result;
  }

  return null;
}

async function main() {
  console.log('Supabaseから店舗一覧を取得中...');

  const { data: stores, error } = await supabase
    .from('stores')
    .select('id, name, prefecture, address, latitude, longitude')
    .order('prefecture_code');

  if (error) {
    console.error('取得エラー:', error.message);
    process.exit(1);
  }

  console.log(`${stores.length}件の店舗を処理します\n`);

  let success = 0;
  let skip = 0;
  let fail = 0;

  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];

    // すでに座標がある場合はスキップ
    if (store.latitude && store.longitude) {
      console.log(`[${i + 1}/${stores.length}] スキップ（既取得）: ${store.name}`);
      skip++;
      continue;
    }

    try {
      const coords = await geocodeStore(store);

      if (coords) {
        const { error: updateError } = await supabase
          .from('stores')
          .update({ latitude: coords.latitude, longitude: coords.longitude })
          .eq('id', store.id);

        if (updateError) {
          console.error(`  更新エラー: ${updateError.message}`);
          fail++;
        } else {
          console.log(
            `[${i + 1}/${stores.length}] ✓ ${store.name} → (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`
          );
          success++;
        }
      } else {
        console.log(`[${i + 1}/${stores.length}] ✗ 座標未取得: ${store.name}`);
        fail++;
      }
    } catch (e) {
      console.error(`[${i + 1}/${stores.length}] エラー: ${store.name} - ${e.message}`);
      fail++;
    }

    // Nominatim レート制限: 1リクエスト/秒
    if (i < stores.length - 1) {
      await sleep(1100);
    }
  }

  console.log(`\n完了: 成功 ${success}件 / スキップ ${skip}件 / 失敗 ${fail}件`);
}

main();

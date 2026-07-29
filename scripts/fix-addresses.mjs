/**
 * 住所フォーマットを改善して再取得するスクリプト
 * - 国道・県道などの道路名を住所から除外
 * - 座標がある全店舗を逆ジオコーディングし直す
 *
 * 実行方法:
 *   node scripts/fix-addresses.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mxplxvthjtxbxehigpki.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const HEADERS = { 'User-Agent': 'timelesz-zaiko-checker/1.0 (fan site)' };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 高速・国道・県道などの道路名かどうか判定 */
function isHighwayName(road) {
  if (!road) return false;
  return /国道|県道|都道|府道|道道|号線|高速|自動車道|臨港道路|環状線|バイパス/.test(road);
}

/** Nominatimの構造化住所から日本語住所を生成（道路名を除外） */
function formatJapaneseAddress(addr) {
  if (!addr) return null;

  // road フィールドが高速・幹線道路なら除外
  const road = isHighwayName(addr.road) ? null : addr.road;

  const parts = [
    addr.state,                                                          // 都道府県
    addr.county || addr.city || addr.town || addr.municipality,         // 市区町村
    addr.suburb || addr.neighbourhood || addr.quarter || addr.village,  // 町・丁目
    road,                                                                // 通り名（幹線道路は除外）
    addr.house_number,                                                   // 番地
  ].filter(Boolean);

  if (parts.length === 0) return null;
  return parts.join('');
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

async function main() {
  console.log('座標がある全店舗を取得中...');

  const { data: stores, error } = await supabase
    .from('stores')
    .select('id, name, prefecture, latitude, longitude, address')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .order('prefecture_code');

  if (error) {
    console.error('取得エラー:', error.message);
    process.exit(1);
  }

  console.log(`${stores.length}件を再処理します（約${Math.ceil(stores.length * 1.1 / 60)}分）\n`);

  let updated = 0;
  let unchanged = 0;
  let fail = 0;

  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    process.stdout.write(`[${i + 1}/${stores.length}] ${store.name}... `);

    try {
      const newAddress = await reverseGeocode(store.latitude, store.longitude);

      if (newAddress) {
        if (newAddress === store.address) {
          console.log(`変更なし: ${newAddress}`);
          unchanged++;
        } else {
          const { error: updateError } = await supabase
            .from('stores')
            .update({ address: newAddress })
            .eq('id', store.id);

          if (updateError) {
            console.log(`更新エラー: ${updateError.message}`);
            fail++;
          } else {
            console.log(`✓ ${store.address || '（未登録）'} → ${newAddress}`);
            updated++;
          }
        }
      } else {
        console.log(`✗ 取得失敗`);
        fail++;
      }
    } catch (e) {
      console.log(`エラー: ${e.message}`);
      fail++;
    }

    if (i < stores.length - 1) await sleep(1100);
  }

  console.log(`\n完了: 更新 ${updated}件 / 変更なし ${unchanged}件 / 失敗 ${fail}件`);
}

main();

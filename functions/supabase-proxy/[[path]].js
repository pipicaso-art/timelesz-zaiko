/**
 * Cloudflare Pages Function - Supabase キャッシュプロキシ
 * GET リクエストを 60 秒キャッシュして Supabase エグレスを削減
 */

const SUPABASE_URL = 'https://mxplxvthjtxbxehigpki.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq';
const CACHE_TTL = 60; // seconds

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // /supabase-proxy プレフィックスを除いて Supabase URL を組み立て
  const supabasePath = url.pathname.replace(/^\/supabase-proxy/, '');
  const targetUrl = `${SUPABASE_URL}${supabasePath}${url.search}`;

  const preferHeader = request.headers.get('Prefer') || '';

  const forwardHeaders = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
  if (preferHeader) forwardHeaders['Prefer'] = preferHeader;

  // POST / DELETE / PATCH はキャッシュしない（書き込み操作）
  if (request.method !== 'GET') {
    const body = request.body ? await request.text() : undefined;
    const res = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
    });
    return new Response(res.body, {
      status: res.status,
      headers: buildResponseHeaders(res),
    });
  }

  // GET: キャッシュをチェック
  const cache = caches.default;
  // URL + Prefer ヘッダーをキャッシュキーに含める
  const cacheKeyUrl = `https://cache-proxy.internal/${encodeURIComponent(targetUrl + '::' + preferHeader)}`;
  const cacheRequest = new Request(cacheKeyUrl);

  const cached = await cache.match(cacheRequest);
  if (cached) {
    const headers = new Headers(cached.headers);
    headers.set('X-Cache', 'HIT');
    return new Response(cached.body, { status: cached.status, headers });
  }

  // キャッシュなし → Supabase にフェッチ
  const supabaseRes = await fetch(targetUrl, { headers: forwardHeaders });

  const resHeaders = buildResponseHeaders(supabaseRes);
  resHeaders.set('Cache-Control', `public, max-age=${CACHE_TTL}`);
  resHeaders.set('X-Cache', 'MISS');

  const body = await supabaseRes.text();

  const responseToCache = new Response(body, {
    status: supabaseRes.status,
    headers: resHeaders,
  });

  // 非同期でキャッシュに保存（レスポンスは先に返す）
  context.waitUntil(cache.put(cacheRequest, responseToCache.clone()));

  return responseToCache;
}

function buildResponseHeaders(res) {
  const h = new Headers();
  // Supabase から返ってくる重要なヘッダーを転送
  const copy = ['Content-Type', 'Content-Range', 'X-Total-Count', 'Range-Unit'];
  for (const name of copy) {
    const val = res.headers.get(name);
    if (val) h.set(name, val);
  }
  // CORS（同一オリジンなので不要だが念のため）
  h.set('Access-Control-Allow-Origin', '*');
  return h;
}

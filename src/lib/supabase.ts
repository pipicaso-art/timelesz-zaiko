// Supabase REST API direct fetch helper (browser-safe, no SDK)
export const SUPABASE_URL = 'https://mxplxvthjtxbxehigpki.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq';

export const SUPABASE_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export async function supabaseFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...SUPABASE_HEADERS,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function supabaseGet(table: string, params: Record<string, string> = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  url.searchParams.set('select', params.select ?? '*');
  if (params.order) url.searchParams.set('order', params.order);
  if (params.limit) url.searchParams.set('limit', params.limit);
  if (params.eq) {
    const [col, val] = params.eq.split('=');
    url.searchParams.set(col, `eq.${val}`);
  }
  if (params.in) {
    const [col, vals] = params.in.split('=');
    url.searchParams.set(col, `in.(${vals})`);
  }

  const res = await fetch(url.toString(), { headers: SUPABASE_HEADERS });
  if (!res.ok) {
    const err = await res.text();
    return { data: null, error: err };
  }
  const data = await res.json();
  return { data, error: null };
}

export async function supabasePost(table: string, body: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...SUPABASE_HEADERS, Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    return { data: null, error: err };
  }
  const data = await res.json();
  return { data: Array.isArray(data) ? data[0] : data, error: null };
}

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://mxplxvthjtxbxehigpki.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq';

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export async function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get('store_id');
  if (!storeId) return NextResponse.json({ error: 'store_id required' }, { status: 400 });

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/comments?store_id=eq.${storeId}&select=id,text,created_at&order=created_at.desc&limit=50`,
    { headers, cache: 'no-store' }
  );

  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  const data = await res.json();
  return NextResponse.json({ comments: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { store_id, text } = body;

  if (!store_id || !text?.trim()) {
    return NextResponse.json({ error: '内容を入力してください' }, { status: 400 });
  }
  if (text.trim().length > 200) {
    return NextResponse.json({ error: '200文字以内で入力してください' }, { status: 400 });
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({ store_id, text: text.trim() }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data[0] ?? data, { status: 201 });
}

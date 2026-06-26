import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://mxplxvthjtxbxehigpki.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq';

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

// GET /api/stock?prefecture=tokyo
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prefecture = searchParams.get('prefecture');

  if (!prefecture) {
    return NextResponse.json({ error: 'prefecture is required' }, { status: 400 });
  }

  const storesRes = await fetch(
    `${SUPABASE_URL}/rest/v1/stores?prefecture_code=eq.${prefecture}&order=name&select=*`,
    { headers, cache: 'no-store' }
  );
  if (!storesRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
  const stores = await storesRes.json();

  if (!stores || stores.length === 0) {
    return NextResponse.json({ stores: [], stock: {} });
  }

  const storeIds = stores.map((s: { id: string }) => s.id).join(',');

  const stockRes = await fetch(
    `${SUPABASE_URL}/rest/v1/latest_stock?store_id=in.(${storeIds})&select=*`,
    { headers, cache: 'no-store' }
  );
  if (!stockRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
  const stockData = await stockRes.json();

  const stockByStore: Record<string, Record<string, { quantity_range: string; note: string | null; created_at: string }>> = {};
  for (const item of stockData || []) {
    if (!stockByStore[item.store_id]) {
      stockByStore[item.store_id] = {};
    }
    stockByStore[item.store_id][item.edition] = {
      quantity_range: item.quantity_range,
      note: item.note,
      created_at: item.created_at,
    };
  }

  return NextResponse.json({ stores, stock: stockByStore });
}

// POST /api/stock
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { store_id, edition, quantity_range, note } = body;

  if (!store_id || !edition || !quantity_range) {
    return NextResponse.json(
      { error: 'store_id, edition, quantity_range are required' },
      { status: 400 }
    );
  }

  const validEditions = ['first_a', 'first_b', 'normal'];
  const validRanges = ['500+', '200-499', '30-199', '1-29', 'none'];

  if (!validEditions.includes(edition)) {
    return NextResponse.json({ error: 'Invalid edition' }, { status: 400 });
  }
  if (!validRanges.includes(quantity_range)) {
    return NextResponse.json({ error: 'Invalid quantity_range' }, { status: 400 });
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/stock_updates`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({ store_id, edition, quantity_range, note }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data[0] ?? data, { status: 201 });
}

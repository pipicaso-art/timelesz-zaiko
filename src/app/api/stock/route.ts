import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET /api/stock?prefecture=tokyo
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const prefecture = searchParams.get('prefecture');

  if (!prefecture) {
    return NextResponse.json({ error: 'prefecture is required' }, { status: 400 });
  }

  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('*')
    .eq('prefecture_code', prefecture)
    .order('name');

  if (storesError) {
    return NextResponse.json({ error: storesError.message }, { status: 500 });
  }

  if (!stores || stores.length === 0) {
    return NextResponse.json({ stores: [], stock: {} });
  }

  const storeIds = stores.map((s: { id: string }) => s.id);

  // Get latest stock for each store and edition
  const { data: stockData, error: stockError } = await supabase
    .from('latest_stock')
    .select('*')
    .in('store_id', storeIds);

  if (stockError) {
    return NextResponse.json({ error: stockError.message }, { status: 500 });
  }

  // Group stock by store_id
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
  const supabase = getSupabase();
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

  const { data, error } = await supabase
    .from('stock_updates')
    .insert({ store_id, edition, quantity_range, note: note || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/recent - 最近の更新10件
export async function GET() {
  const { data, error } = await supabase
    .from('stock_updates')
    .select(`
      id,
      edition,
      quantity_range,
      note,
      created_at,
      stores (
        id,
        name,
        prefecture,
        prefecture_code
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ updates: data });
}

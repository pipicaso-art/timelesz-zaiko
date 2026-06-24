import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }),
    },
  }
);

export async function GET() {
  const { data, error } = await supabase
    .from('song_stats')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // テーブルがない場合はデフォルト値を返す
    return NextResponse.json({
      billboard_count: 0,
      own_count: 0,
      target: 500000,
      updated_at: new Date().toISOString(),
    });
  }

  return NextResponse.json(data);
}

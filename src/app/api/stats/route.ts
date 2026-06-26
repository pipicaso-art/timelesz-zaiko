import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://mxplxvthjtxbxehigpki.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq',
    {
      global: {
        fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }),
      },
    }
  );
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('song_stats')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({
      billboard_count: 0,
      own_count: 0,
      target: 500000,
      updated_at: new Date().toISOString(),
    });
  }

  return NextResponse.json(data);
}

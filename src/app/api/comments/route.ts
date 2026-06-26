import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://mxplxvthjtxbxehigpki.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq'
  );
}

export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const storeId = req.nextUrl.searchParams.get('store_id');
  if (!storeId) return NextResponse.json({ error: 'store_id required' }, { status: 400 });

  const { data, error } = await supabase
    .from('comments')
    .select('id, text, created_at')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comments: data });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();
  const { store_id, text } = body;

  if (!store_id || !text?.trim()) {
    return NextResponse.json({ error: '内容を入力してください' }, { status: 400 });
  }
  if (text.trim().length > 200) {
    return NextResponse.json({ error: '200文字以内で入力してください' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({ store_id, text: text.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export const runtime = 'edge';

export async function GET() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      'https://mxplxvthjtxbxehigpki.supabase.co',
      'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq'
    );
    const { data, error } = await supabase.from('song_stats').select('*').limit(1);
    return Response.json({ ok: true, data, error: error?.message ?? null });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

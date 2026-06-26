export const runtime = 'edge';

export async function GET() {
  // Step 1: test raw fetch to Supabase REST API (no SDK)
  try {
    const url = 'https://mxplxvthjtxbxehigpki.supabase.co/rest/v1/song_stats?select=*&limit=1';
    const res = await fetch(url, {
      headers: {
        'apikey': 'sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq',
        'Authorization': 'Bearer sb_publishable_P--sYozZCBfaRs06HPgaQQ_ipkFzEwq',
      },
    });
    const body = await res.text();
    return Response.json({ ok: true, status: res.status, body });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) });
  }
}

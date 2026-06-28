// API routes are not used in static export.
// Data is fetched directly from Supabase on the client side.
export const dynamic = 'force-static';
export function GET() {
  return Response.json({ message: 'Use Supabase directly' });
}

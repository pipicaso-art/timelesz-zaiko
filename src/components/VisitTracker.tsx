'use client';

import { useEffect } from 'react';
import { SUPABASE_URL, SUPABASE_HEADERS } from '@/lib/supabase';

export function VisitTracker() {
  useEffect(() => {
    // セッション中1回だけカウント（リロードは除外）
    if (sessionStorage.getItem('visit_tracked')) return;
    sessionStorage.setItem('visit_tracked', '1');

    const sessionId = Math.random().toString(36).slice(2);

    fetch(`${SUPABASE_URL}/rest/v1/visits`, {
      method: 'POST',
      headers: { ...SUPABASE_HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify({ session_id: sessionId }),
    }).catch(() => {/* サイレントに失敗 */});
  }, []);

  return null;
}

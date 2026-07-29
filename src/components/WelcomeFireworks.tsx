'use client';

import { useEffect, useState } from 'react';
import { Fireworks } from './Fireworks';

export function WelcomeFireworks() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // セッション中1回だけ表示
    if (!sessionStorage.getItem('welcomeFireworksShown')) {
      sessionStorage.setItem('welcomeFireworksShown', '1');
      // 少し遅らせてページが描画されてから起動
      const t = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  return <Fireworks show={show} onDone={() => setShow(false)} />;
}

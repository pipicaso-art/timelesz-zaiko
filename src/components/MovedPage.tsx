'use client';

import { useEffect, useState } from 'react';
import { MemberWalkAnimation } from './MemberWalkAnimation';

const NEW_URL = 'https://timelesz-zaiko.pipicaso.workers.dev';
const COUNTDOWN_SECONDS = 7;

export function MovedPage() {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          window.location.replace(NEW_URL);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: '#2DD4BF' }}
    >
      {/* tz バッジ */}
      <div
        className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-4xl font-black tracking-tighter shadow-xl mb-5"
        style={{ color: '#2DD4BF', letterSpacing: '-3px' }}
      >
        tz
      </div>

      {/* タイトル */}
      <h1 className="text-white text-2xl font-black mb-1">
        timelesz在庫チェッカー
      </h1>
      <p className="text-white/60 text-xs mb-8">※ファンサイト（unofficial）</p>

      {/* メッセージカード */}
      <div
        className="rounded-2xl p-5 max-w-sm w-full text-center mb-6"
        style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
      >
        <p className="text-white font-bold text-base mb-3">
          🙏 サイトURLが新しくなりました
        </p>
        <p className="text-white/90 text-sm leading-relaxed">
          たくさんのアクセスをありがとうございます！
          <br />
          アクセスが集中しサーバーの利用上限に達したため、
          <br />
          より安定した新しいサーバーへ移転しました。
          <br />
          <br />
          ブックマークの更新をお願いします。
        </p>
      </div>

      {/* 大きなバナーボタン */}
      <a
        href={NEW_URL}
        className="block w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden"
        style={{ transition: 'transform 0.15s', transform: 'scale(1)' }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <MemberWalkAnimation />
        <div className="px-6 py-4 text-center border-t border-gray-100">
          <p className="text-gray-400 text-xs mb-1">新しいサイトはこちら</p>
          <p
            className="font-black text-xl"
            style={{ color: '#2DD4BF' }}
          >
            開く →
          </p>
          <p className="text-gray-300 text-[10px] mt-2 break-all">{NEW_URL}</p>
        </div>
      </a>

      {/* カウントダウン */}
      <p className="text-white/60 text-sm mt-5">
        {seconds > 0
          ? `${seconds}秒後に自動で移動します…`
          : '移動しています…'}
      </p>
    </div>
  );
}

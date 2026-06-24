'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Comment {
  id: string;
  text: string;
  created_at: string;
}

interface Props {
  storeId: string;
}

export function CommentSection({ storeId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function loadComments() {
    const res = await fetch(`/api/comments?store_id=${storeId}`);
    const data = await res.json();
    setComments(data.comments || []);
    setLoading(false);
  }

  useEffect(() => {
    loadComments();
  }, [storeId]);

  async function handleSubmit() {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: storeId, text }),
      });
      if (res.ok) {
        setText('');
        await loadComments();
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      {/* ヘッダー */}
      <p className="text-xs font-bold text-gray-500 mb-2">
        コメント{comments.length > 0 ? `（${comments.length}）` : ''}
      </p>

      {/* コメント一覧 */}
      {loading ? (
        <div className="text-xs text-gray-400 animate-pulse">読み込み中...</div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400 mb-2">まだコメントがありません</p>
      ) : (
        <ul className="space-y-2 mb-3 max-h-48 overflow-y-auto">
          {[...comments].reverse().map((c) => (
            <li key={c.id} className="flex gap-2 text-xs">
              <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{c.text}</p>
              </div>
              <span className="text-gray-400 shrink-0 pt-1.5">
                {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: ja })}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* コメント入力 */}
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="コメントを追加... (Ctrl+Enterで送信)"
          rows={2}
          maxLength={200}
          className="flex-1 text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          className="shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      {text.length > 150 && (
        <p className="text-xs text-gray-400 mt-1 text-right">{text.length}/200</p>
      )}
    </div>
  );
}

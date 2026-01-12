'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askAI = async () => {
    setLoading(true);
    setAnswer('');
    setError('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? 'エラーが発生しました');
      } else {
        setAnswer(data?.answer ?? '');
      }
    } catch (e: any) {
      setError(e?.message ?? '通信エラー');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h1>Gemini 動作テスト</h1>
      <p style={{ color: '#666' }}>
        質問して、回答が返ればOK（納品用の動作確認）
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        style={{ width: '100%', marginTop: 16, padding: 12, fontSize: 16 }}
        placeholder="例）栃木県で家を建てるときに使えそうな補助金を、3つに絞って教えて"
      />

      <div style={{ marginTop: 12 }}>
        <button
          onClick={askAI}
          disabled={loading || !question.trim()}
          style={{ padding: '10px 18px', fontSize: 16 }}
        >
          {loading ? '質問中...' : '質問する'}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 20, color: 'crimson', whiteSpace: 'pre-wrap' }}>
          <strong>エラー：</strong> {error}
        </div>
      )}

      {answer && (
        <div style={{ marginTop: 24, whiteSpace: 'pre-wrap' }}>
          <h3>回答</h3>
          <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
            {answer}
          </div>
        </div>
      )}
    </main>
  );
}

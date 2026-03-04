"use client";

import { useState } from "react";
import Link from "next/link";

const examples = [
  "私はコーヒーが好きです",
  "明日映画を見に行きます",
  "Thank you for your help!",
  "안녕하세요, 만나서 반갑습니다",
  "I love ramen very much",
  "나는 매일 운동을 합니다",
];

const centerStyle = { maxWidth: "42rem", margin: "0 auto", padding: "0 16px" };

export default function TranslatePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const translate = async (t?: string) => {
    const query = t || text.trim();
    if (!query) return;
    setText(query);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          mode: "translate",
          level: "N3",
        }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch {
      setResult("❌ 번역 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (text: string) =>
    text.split("\n").map((line, i) => {
      if (line.match(/^\d+\./)) {
        const colonIdx = line.indexOf(":");
        return (
          <div
            key={i}
            className="mb-3 p-3 glass rounded-xl border border-white/5"
          >
            <div className="text-teal-400 font-bold text-sm mb-1">
              {line.slice(0, colonIdx)}
            </div>
            {line.slice(colonIdx + 1) && (
              <div className="text-white/80 text-base font-jp leading-relaxed">
                {line.slice(colonIdx + 1)}
              </div>
            )}
          </div>
        );
      }
      return line ? (
        <p key={i} className="text-white/60 text-sm leading-relaxed mb-1">
          {line}
        </p>
      ) : (
        <div key={i} className="h-1.5" />
      );
    });

  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      <header
        className="glass border-b border-white/10 sticky top-0 z-10"
        style={{ width: "100%" }}
      >
        <div
          style={{
            ...centerStyle,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
          }}
        >
          <Link
            href="/"
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            ← 홈
          </Link>
          <span className="text-white/20">|</span>
          <h1 className="font-bold text-white text-sm">🔄 AI 번역</h1>
        </div>
      </header>

      <div
        style={{ ...centerStyle, paddingTop: "24px", paddingBottom: "24px" }}
      >
        <div className="glass rounded-2xl border border-white/10 p-5 mb-5">
          <h2 className="text-base font-bold text-white mb-4">
            번역하기{" "}
            <span className="text-white/40 text-sm font-normal">
              한국어, 영어 → 일본어
            </span>
          </h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) translate();
            }}
            placeholder="번역할 문장을 입력하세요..."
            className="w-full glass border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 bg-transparent input-glow resize-none mb-4 text-sm"
            rows={4}
          />
          <button
            onClick={() => translate()}
            disabled={loading || !text.trim()}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "번역 중..." : "🔄 번역하기"}
          </button>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-4 mb-5">
          <p className="text-xs text-white/40 mb-3">📝 예문으로 시작하기</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => translate(ex)}
                className="glass border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white/70 hover:border-teal-500/50 hover:text-white transition-all duration-200 active:scale-95"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="glass rounded-2xl border border-white/10 p-8 text-center">
            <div className="flex justify-center gap-2 mb-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-teal-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-white/50 text-sm">AI가 번역 중입니다...</p>
          </div>
        )}

        {result && !loading && (
          <div className="glass rounded-2xl border border-teal-500/30 p-5 animate-fade-in-up bg-gradient-to-br from-teal-500/10 to-cyan-600/10">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <span className="text-xl">🔄</span>
              <h3 className="text-white font-bold text-sm">번역 결과</h3>
            </div>
            <div>{renderResult(result)}</div>
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-12 text-white/30">
            <div className="text-5xl mb-3">🔄</div>
            <p className="text-base">문장을 입력하면 일본어로 번역해드립니다</p>
            <p className="text-sm mt-1">발음과 표현 팁도 함께 제공됩니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

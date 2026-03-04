"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import * as wanakana from "wanakana";

const levels = ["N5", "N4", "N3", "N2", "N1"];

const difficultyColors: Record<string, string> = {
  필수: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  중요: "border-blue-500/40 text-blue-400 bg-blue-500/10",
  심화: "border-rose-500/40 text-rose-400 bg-rose-500/10",
};

interface RecommendedGrammar {
  pattern: string;
  meaning: string;
  example: string;
  difficulty: string;
}

const centerStyle = { maxWidth: "42rem", margin: "0 auto", padding: "0 16px" };

export default function GrammarPage() {
  const [grammar, setGrammar] = useState("");
  const [searchedGrammar, setSearchedGrammar] = useState("");
  const [searchLevel, setSearchLevel] = useState("N5");
  const [recLevel, setRecLevel] = useState("N5");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedGrammar[]>(
    [],
  );
  const [recLoading, setRecLoading] = useState(false);
  const [recAttempted, setRecAttempted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    wanakana.bind(el, { IMEMode: true });
    return () => wanakana.unbind(el);
  }, []);

  const fetchRecommendations = async () => {
    setRecLoading(true);
    setRecAttempted(true);
    setRecommendations([]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "",
          mode: "recommend-grammar",
          level: recLevel,
        }),
      });
      const data = await res.json();
      const text = data.result.trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setRecommendations(parsed);
      }
    } catch {
      // 추천 실패 시 무시
    } finally {
      setRecLoading(false);
    }
  };

  const search = async (g?: string) => {
    const query = g || grammar.trim();
    if (!query) return;
    if (!g) setGrammar(query);
    setSearchedGrammar(query);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          mode: "grammar",
          level: searchLevel,
        }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch {
      setResult("❌ 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const saveGrammar = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("saved_grammar").insert({
      user_id: user.id,
      pattern: searchedGrammar,
      meaning: "",
      level: searchLevel,
      content: result ?? "",
    });
    setSaving(false);
    if (!error) setSaved(true);
  };

  const renderResult = (text: string) =>
    text.split("\n").map((line, i) => {
      if (line.match(/^\d+\./)) {
        const parts = line.split(":");
        return (
          <div
            key={i}
            className="mb-3 p-3 glass rounded-xl border border-white/5"
          >
            <div className="text-blue-400 font-bold text-sm mb-1">
              {parts[0]}
            </div>
            {parts.slice(1).join(":") && (
              <div className="text-white/80 text-sm leading-relaxed">
                {parts.slice(1).join(":")}
              </div>
            )}
          </div>
        );
      }
      if (line.startsWith("-")) {
        return (
          <div
            key={i}
            className="ml-3 text-white/70 text-sm leading-relaxed py-0.5 flex gap-2"
          >
            <span className="text-blue-400 flex-shrink-0">▸</span>
            <span>{line.slice(1).trim()}</span>
          </div>
        );
      }
      return line ? (
        <p key={i} className="text-white/70 text-sm leading-relaxed mb-1">
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
          <h1 className="font-bold text-white text-sm">✍️ 문법 마스터</h1>
        </div>
      </header>

      <div
        style={{ ...centerStyle, paddingTop: "24px", paddingBottom: "24px" }}
      >
        {/* 검색 섹션 */}
        <div className="glass rounded-2xl border border-white/10 p-5 mb-5">
          <h2 className="text-base font-bold text-white mb-4">
            문법 검색{" "}
            <span className="text-white/40 text-sm font-normal">
              문법 형태나 한국어
            </span>
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              ref={inputRef}
              value={grammar}
              onChange={(e) => setGrammar(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="예: te iru → ている, ~たら, 진행형..."
              className="flex-1 glass border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 bg-transparent input-glow font-jp text-sm min-w-0"
            />
            <button
              onClick={() => search()}
              disabled={loading || !grammar.trim()}
              className="px-5 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl text-white font-bold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 text-sm"
            >
              검색
            </button>
          </div>
        </div>

        {/* AI 추천 문법 섹션 */}
        <div className="glass rounded-2xl border border-blue-500/30 p-5 mb-5 bg-gradient-to-br from-blue-500/5 to-cyan-600/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h3 className="text-sm font-bold text-white">AI 추천 문법</h3>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={recLevel}
                onChange={(e) => {
                  setRecLevel(e.target.value);
                  setRecommendations([]);
                  setRecAttempted(false);
                }}
                className="glass border border-white/20 rounded-lg px-2 py-1.5 text-white bg-transparent cursor-pointer text-xs"
              >
                {levels.map((l) => (
                  <option key={l} value={l} className="bg-gray-900">
                    {l}
                  </option>
                ))}
              </select>
              {recommendations.length > 0 && (
                <button
                  onClick={fetchRecommendations}
                  disabled={recLoading}
                  className="text-xs text-white/40 hover:text-blue-400 transition-colors disabled:opacity-40 flex items-center gap-1"
                >
                  <span
                    className={recLoading ? "animate-spin inline-block" : ""}
                  >
                    ↺
                  </span>
                  다시 추천
                </button>
              )}
            </div>
          </div>

          {recommendations.length === 0 && !recLoading && (
            <button
              onClick={fetchRecommendations}
              className="w-full py-4 rounded-xl border border-dashed border-blue-500/40 text-blue-400 text-sm font-semibold hover:bg-blue-500/10 hover:border-blue-500/70 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>✨</span> AI 추천 문법 보기
            </button>
          )}

          {recLoading && (
            <div className="flex items-center gap-3 py-4">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-white/40 text-sm">
                AI가 {recLevel} 레벨 문법을 추천 중...
              </span>
            </div>
          )}

          {recommendations.length > 0 && !recLoading && (
            <div className="grid grid-cols-1 gap-2">
              {recommendations.map((rec, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setGrammar(rec.pattern);
                    search(rec.pattern);
                  }}
                  className="flex items-start gap-3 p-3 glass rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-200 group text-left w-full active:scale-[0.98]"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-white font-jp group-hover:text-blue-300 transition-colors">
                        {rec.pattern}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[rec.difficulty] || "border-white/20 text-white/40"}`}
                      >
                        {rec.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">
                      {rec.meaning}
                    </p>
                    <p className="text-xs text-white/35 mt-1 font-jp">
                      {rec.example}
                    </p>
                  </div>
                  <span className="text-white/30 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">
                    →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 결과 영역 */}
        {loading && (
          <div className="glass rounded-2xl border border-white/10 p-8 text-center">
            <div className="flex justify-center gap-2 mb-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-white/50 text-sm">
              AI가 문법을 분석 중입니다...
            </p>
          </div>
        )}

        {result && !loading && (
          <div className="glass rounded-2xl border border-blue-500/30 p-5 animate-fade-in-up bg-gradient-to-br from-blue-500/10 to-cyan-600/10">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <span className="text-xl">📝</span>
              <h3 className="text-white font-bold text-sm">
                &apos;{searchedGrammar}&apos; 문법 분석
              </h3>
              {/* <span className="level-badge text-white">{searchLevel}</span> */}
              {user ? (
                <button
                  onClick={() => {
                    setSaved(false);
                    saveGrammar();
                  }}
                  disabled={saving || saved}
                  className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    saved
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                      : "glass border border-blue-500/40 text-blue-400 hover:border-blue-400 hover:bg-blue-500/10"
                  }`}
                >
                  {saved ? "✅ 저장됨" : saving ? "저장 중..." : "🔖 저장"}
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs glass border border-white/10 text-white/40 hover:text-white/70 transition-all"
                >
                  🔖 로그인 후 저장
                </Link>
              )}
            </div>
            <div>{renderResult(result)}</div>
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-8 text-white/20">
            <div className="text-4xl mb-2">👆</div>
            <p className="text-sm">
              문법을 검색하거나 추천 문법을 클릭해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

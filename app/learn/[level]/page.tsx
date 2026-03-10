"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface Word {
  word: string;
  reading: string;
  meaning: string;
  category: string;
  example: string;
  example_kr: string;
}

interface Grammar {
  pattern: string;
  meaning: string;
  usage: string;
  example: string;
  example_reading: string;
  example_kr: string;
  difficulty: string;
}

const levelInfo: Record<
  string,
  { label: string; color: string; from: string; to: string }
> = {
  N5: {
    label: "입문",
    color: "emerald",
    from: "from-emerald-500",
    to: "to-green-600",
  },
  N4: {
    label: "초급",
    color: "blue",
    from: "from-blue-500",
    to: "to-cyan-600",
  },
  N3: {
    label: "중급",
    color: "violet",
    from: "from-violet-500",
    to: "to-purple-600",
  },
  N2: {
    label: "상급",
    color: "amber",
    from: "from-amber-500",
    to: "to-orange-600",
  },
  N1: {
    label: "최상급",
    color: "pink",
    from: "from-pink-500",
    to: "to-rose-600",
  },
};

const difficultyColors: Record<string, string> = {
  필수: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  중요: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  심화: "bg-rose-500/20 text-rose-400 border-rose-500/40",
};

const categoryColors: Record<string, string> = {
  동사: "bg-violet-500/20 text-violet-400",
  명사: "bg-blue-500/20 text-blue-400",
  い형용사: "bg-emerald-500/20 text-emerald-400",
  な형용사: "bg-teal-500/20 text-teal-400",
  부사: "bg-amber-500/20 text-amber-400",
  표현: "bg-pink-500/20 text-pink-400",
};

const centerStyle = { maxWidth: "42rem", margin: "0 auto", padding: "0 16px" };

// 한국 날짜 (UTC+9)
function kstToday() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split("T")[0];
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const level = (params?.level as string)?.toUpperCase() || "N5";

  const [tab, setTab] = useState<"words" | "grammar">("words");
  const [words, setWords] = useState<Word[]>([]);
  const [grammar, setGrammar] = useState<Grammar[]>([]);
  const [wordsLoading, setWordsLoading] = useState(false);
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [wordsSource, setWordsSource] = useState<"cache" | "ai" | null>(null);
  const [grammarSource, setGrammarSource] = useState<"cache" | "ai" | null>(
    null,
  );
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const info = levelInfo[level];

  useEffect(() => {
    if (!levelInfo[level]) router.push("/");
  }, [level]);

  // 최초 단어 로드
  useEffect(() => {
    loadWords();
  }, [level]);

  // 탭 전환 시 문법 로드
  useEffect(() => {
    if (tab === "grammar" && grammar.length === 0) loadGrammar();
  }, [tab]);

  /** 캐시 조회 → 없으면 AI 생성 후 저장 */
  async function loadWords() {
    setWordsLoading(true);
    setWords([]);
    const today = kstToday();

    // 1. 캐시 조회
    const { data: cached } = await supabase
      .from("daily_content")
      .select("content")
      .eq("level", level)
      .eq("type", "words")
      .eq("date", today)
      .maybeSingle();

    if (cached?.content) {
      setWords(cached.content as Word[]);
      setWordsSource("cache");
      setWordsLoading(false);
      return;
    }

    // 2. AI 실시간 생성
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "", mode: "level-words", level }),
      });
      const data = await res.json();
      const match = (data.result as string).match(/\[[\s\S]*\]/);
      if (match) {
        const parsed: Word[] = JSON.parse(match[0]);
        setWords(parsed);
        setWordsSource("ai");
        // 3. Supabase에 저장 (이후 방문자는 캐시 사용)
        await supabase.from("daily_content").insert({
          level,
          type: "words",
          content: parsed,
          date: today,
        });
      }
    } catch {
      /* 무시 */
    } finally {
      setWordsLoading(false);
    }
  }

  async function loadGrammar() {
    setGrammarLoading(true);
    setGrammar([]);
    const today = kstToday();

    const { data: cached } = await supabase
      .from("daily_content")
      .select("content")
      .eq("level", level)
      .eq("type", "grammar")
      .eq("date", today)
      .maybeSingle();

    if (cached?.content) {
      setGrammar(cached.content as Grammar[]);
      setGrammarSource("cache");
      setGrammarLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "", mode: "level-grammar", level }),
      });
      const data = await res.json();
      const match = (data.result as string).match(/\[[\s\S]*\]/);
      if (match) {
        const parsed: Grammar[] = JSON.parse(match[0]);
        setGrammar(parsed);
        setGrammarSource("ai");
        await supabase.from("daily_content").insert({
          level,
          type: "grammar",
          content: parsed,
          date: today,
        });
      }
    } catch {
      /* 무시 */
    } finally {
      setGrammarLoading(false);
    }
  }

  const Loading = ({ color }: { color: string }) => (
    <div className="flex flex-col items-center gap-4 py-16">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full bg-${color}-400 animate-bounce`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-white/40 text-sm">
        AI가 {level} 레벨 콘텐츠 생성 중...
      </p>
    </div>
  );

  const SourceBadge = ({ source }: { source: "cache" | "ai" | null }) => {
    if (!source) return null;
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${source === "cache" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}
      >
        {source === "cache" ? "⚡ 캐시" : "🤖 AI 생성"}
      </span>
    );
  };

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
          <span
            className={`text-sm font-black bg-gradient-to-r ${info?.from} ${info?.to} bg-clip-text text-transparent`}
          >
            {level}
          </span>
          <h1 className="font-bold text-white text-sm hidden sm:block">
            {info?.label} 학습
          </h1>
          <div className="ml-auto flex gap-1.5">
            {Object.keys(levelInfo).map((l) => (
              <Link
                key={l}
                href={`/learn/${l}`}
                className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all duration-200 ${
                  l === level
                    ? `bg-gradient-to-r ${info?.from} ${info?.to} text-white`
                    : "text-white/40 hover:text-white"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div
        style={{ ...centerStyle, paddingTop: "24px", paddingBottom: "40px" }}
      >
        {/* 상단 카드 */}
        <div className="glass rounded-2xl border border-white/10 p-5 mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info?.from} ${info?.to} flex items-center justify-center`}
            >
              <span className="text-white font-black text-lg">{level}</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-base">
                {level} · {info?.label}
              </h2>
              <p className="text-white/40 text-xs mt-0.5">
                핵심 단어 50개 + 문법 10개 · 매일 06시 갱신
              </p>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="glass rounded-2xl border border-white/10 p-1 flex mb-5">
          <button
            onClick={() => {
              setTab("words");
              setExpandedIdx(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${tab === "words" ? `bg-gradient-to-r ${info?.from} ${info?.to} text-white shadow-lg` : "text-white/50 hover:text-white"}`}
          >
            📚 단어{" "}
            {words.length > 0 && (
              <span className="opacity-70 text-xs">{words.length}개</span>
            )}
            {tab === "words" && <SourceBadge source={wordsSource} />}
          </button>
          <button
            onClick={() => {
              setTab("grammar");
              setExpandedIdx(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${tab === "grammar" ? `bg-gradient-to-r ${info?.from} ${info?.to} text-white shadow-lg` : "text-white/50 hover:text-white"}`}
          >
            ✍️ 문법{" "}
            {grammar.length > 0 && (
              <span className="opacity-70 text-xs">{grammar.length}개</span>
            )}
            {tab === "grammar" && <SourceBadge source={grammarSource} />}
          </button>
        </div>

        {/* 단어 */}
        {tab === "words" && (
          <>
            {wordsLoading && <Loading color={info?.color} />}
            {!wordsLoading &&
              words.map((w, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-200 mb-2"
                  onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                >
                  <div className="flex items-center gap-3 p-3">
                    <span className="text-white/25 text-xs w-6 text-right flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-white font-bold font-jp flex-1">
                      {w.word}
                    </span>
                    <span className="text-white/50 text-xs font-jp">
                      {w.reading}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[w.category] || "bg-white/10 text-white/50"}`}
                    >
                      {w.category}
                    </span>
                    <span className="text-white/30 text-xs">
                      {expandedIdx === i ? "▲" : "▼"}
                    </span>
                  </div>
                  {expandedIdx === i && (
                    <div className="px-4 pb-4 pt-2 border-t border-white/10 bg-white/5">
                      <p className="text-white font-semibold text-sm mb-2">
                        {w.meaning}
                      </p>
                      <p className="text-white/70 text-sm font-jp">
                        {w.example}
                      </p>
                      <p className="text-white/40 text-xs mt-1">
                        {w.example_kr}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </>
        )}

        {/* 문법 */}
        {tab === "grammar" && (
          <>
            {grammarLoading && <Loading color={info?.color} />}
            {!grammarLoading &&
              grammar.map((g, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-200 mb-3"
                  onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                >
                  <div className="flex items-center gap-3 p-4">
                    <span className="text-white/25 text-xs w-6 text-right flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold font-jp">
                        {g.pattern}
                      </p>
                      <p className="text-white/50 text-xs mt-0.5 truncate">
                        {g.meaning}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[g.difficulty] || "bg-white/10 text-white/40 border-white/20"}`}
                    >
                      {g.difficulty}
                    </span>
                    <span className="text-white/30 text-xs">
                      {expandedIdx === i ? "▲" : "▼"}
                    </span>
                  </div>
                  {expandedIdx === i && (
                    <div className="px-4 pb-4 pt-2 border-t border-white/10 bg-white/5 space-y-2">
                      <p>
                        <span className="text-white/40 text-xs">접속: </span>
                        <span className="text-blue-400 text-xs">{g.usage}</span>
                      </p>
                      <div className="p-3 glass rounded-xl">
                        <p className="text-white/80 text-sm font-jp">
                          {g.example}
                        </p>
                        <p className="text-white/50 text-xs mt-1 font-jp">
                          {g.example_reading}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {g.example_kr}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

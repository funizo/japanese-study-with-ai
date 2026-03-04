"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface SavedWord {
  id: string;
  word: string;
  level: string;
  content: string;
  created_at: string;
}

interface SavedGrammar {
  id: string;
  pattern: string;
  level: string;
  content: string;
  created_at: string;
}

const centerStyle = { maxWidth: "42rem", margin: "0 auto", padding: "0 16px" };

const renderContent = (text: string) =>
  text.split("\n").map((line, i) => {
    if (line.match(/^\d+\./)) {
      return (
        <div key={i} className="mb-3">
          <div className="text-pink-400 font-semibold text-sm mb-1">
            {line.split(":")[0]}:
          </div>
          <div className="text-white/80 pl-3 text-sm leading-relaxed">
            {line.split(":").slice(1).join(":")}
          </div>
        </div>
      );
    }
    if (line.startsWith("-")) {
      return (
        <div
          key={i}
          className="ml-3 text-white/70 text-sm leading-relaxed py-0.5 flex gap-2"
        >
          <span className="text-violet-400 flex-shrink-0">▸</span>
          <span>{line.slice(1).trim()}</span>
        </div>
      );
    }
    return line ? (
      <p key={i} className="text-white/70 text-sm leading-relaxed mb-1">
        {line}
      </p>
    ) : (
      <br key={i} />
    );
  });

export default function SavedPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<"words" | "grammar">("words");
  const [words, setWords] = useState<SavedWord[]>([]);
  const [grammar, setGrammar] = useState<SavedGrammar[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth");
        return;
      }
      fetchAll();
    });
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [wRes, gRes] = await Promise.all([
      supabase
        .from("saved_words")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("saved_grammar")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    if (wRes.data) setWords(wRes.data);
    if (gRes.data) setGrammar(gRes.data);
    setLoading(false);
  };

  const deleteWord = async (id: string) => {
    setDeleting(id);
    await supabase.from("saved_words").delete().eq("id", id);
    setWords((prev) => prev.filter((w) => w.id !== id));
    setDeleting(null);
  };

  const deleteGrammar = async (id: string) => {
    setDeleting(id);
    await supabase.from("saved_grammar").delete().eq("id", id);
    setGrammar((prev) => prev.filter((g) => g.id !== id));
    setDeleting(null);
  };

  const levelColors: Record<string, string> = {
    N5: "from-emerald-500 to-green-600",
    N4: "from-blue-500 to-cyan-600",
    N3: "from-violet-500 to-purple-600",
    N2: "from-amber-500 to-orange-600",
    N1: "from-pink-500 to-rose-600",
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      {/* 헤더 */}
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
          <h1 className="font-bold text-white text-sm">🔖 저장 목록</h1>
        </div>
      </header>

      <div
        style={{ ...centerStyle, paddingTop: "24px", paddingBottom: "40px" }}
      >
        {/* 탭 */}
        <div className="glass rounded-2xl border border-white/10 p-1 flex mb-6">
          <button
            onClick={() => setTab("words")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              tab === "words"
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            📚 저장된 단어
            {words.length > 0 && (
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                {words.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("grammar")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              tab === "grammar"
                ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            ✍️ 저장된 문법
            {grammar.length > 0 && (
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                {grammar.length}
              </span>
            )}
          </button>
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="flex justify-center gap-2 py-16">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* 단어 탭 */}
        {!loading && tab === "words" && (
          <div>
            {words.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-sm">저장된 단어가 없습니다</p>
                <Link
                  href="/vocabulary"
                  className="mt-4 inline-block text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  단어 학습하러 가기 →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {words.map((item) => (
                  <div
                    key={item.id}
                    className="glass rounded-2xl border border-violet-500/20 overflow-hidden"
                  >
                    {/* 카드 헤더 */}
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() =>
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-br ${levelColors[item.level] || "from-gray-400 to-gray-600"} flex-shrink-0`}
                      />
                      <span className="font-bold text-white font-jp flex-1">
                        {item.word}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${levelColors[item.level] || "from-gray-500 to-gray-600"} text-white font-bold`}
                      >
                        {item.level}
                      </span>
                      <span className="text-white/30 text-xs">
                        {new Date(item.created_at).toLocaleDateString("ko-KR")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWord(item.id);
                        }}
                        disabled={deleting === item.id}
                        className="text-white/20 hover:text-rose-400 transition-colors text-sm ml-1 disabled:opacity-40"
                      >
                        {deleting === item.id ? "..." : "✕"}
                      </button>
                      <span className="text-white/30 text-xs">
                        {expandedId === item.id ? "▲" : "▼"}
                      </span>
                    </div>
                    {/* 펼쳐진 내용 */}
                    {expandedId === item.id && item.content && (
                      <div className="px-4 pb-4 border-t border-white/10 pt-3 bg-violet-500/5">
                        {renderContent(item.content)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 문법 탭 */}
        {!loading && tab === "grammar" && (
          <div>
            {grammar.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-sm">저장된 문법이 없습니다</p>
                <Link
                  href="/grammar"
                  className="mt-4 inline-block text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  문법 학습하러 가기 →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {grammar.map((item) => (
                  <div
                    key={item.id}
                    className="glass rounded-2xl border border-blue-500/20 overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() =>
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-br ${levelColors[item.level] || "from-gray-400 to-gray-600"} flex-shrink-0`}
                      />
                      <span className="font-bold text-white font-jp flex-1">
                        {item.pattern}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${levelColors[item.level] || "from-gray-500 to-gray-600"} text-white font-bold`}
                      >
                        {item.level}
                      </span>
                      <span className="text-white/30 text-xs">
                        {new Date(item.created_at).toLocaleDateString("ko-KR")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteGrammar(item.id);
                        }}
                        disabled={deleting === item.id}
                        className="text-white/20 hover:text-rose-400 transition-colors text-sm ml-1 disabled:opacity-40"
                      >
                        {deleting === item.id ? "..." : "✕"}
                      </button>
                      <span className="text-white/30 text-xs">
                        {expandedId === item.id ? "▲" : "▼"}
                      </span>
                    </div>
                    {expandedId === item.id && item.content && (
                      <div className="px-4 pb-4 border-t border-white/10 pt-3 bg-blue-500/5">
                        {renderContent(item.content)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

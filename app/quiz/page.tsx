"use client";

import { useState } from "react";
import Link from "next/link";

const levels = ["N5", "N4", "N3", "N2", "N1"];
const topics = ["단어", "문법", "한자", "청해", "독해", "회화", "경어"];

interface Quiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export default function QuizPage() {
  const [level, setLevel] = useState("N5");
  const [topic, setTopic] = useState("단어");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateQuiz = async () => {
    setLoading(true);
    setQuiz(null);
    setSelected(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: topic, mode: "quiz", level }),
      });
      const data = await res.json();

      const text = data.result.trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setQuiz(parsed);
      } else {
        throw new Error("JSON 파싱 실패");
      }
    } catch {
      setQuiz({
        question: "파싱 오류: 다시 시도해주세요",
        options: [],
        answer: 0,
        explanation: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setScore((prev) => ({
      correct: prev.correct + (idx === quiz?.answer ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const isCorrect = selected === quiz?.answer;

  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      {/* 헤더 */}
      <header
        className="glass border-b border-white/10 sticky top-0 z-10"
        style={{ width: "100%" }}
      >
        <div
          style={{
            maxWidth: "42rem",
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href="/"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← 홈
            </Link>
            <span className="text-white/20">|</span>
            <h1 className="font-bold text-white text-sm">🧠 AI 퀴즈</h1>
          </div>
          {score.total > 0 && (
            <div className="glass border border-white/10 rounded-xl px-3 py-1.5 text-sm">
              <span className="text-emerald-400 font-bold">
                {score.correct}
              </span>
              <span className="text-white/40"> / </span>
              <span className="text-white/60">{score.total}</span>
            </div>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div
        style={{ maxWidth: "42rem", margin: "0 auto", padding: "24px 16px" }}
      >
        {/* 설정 */}
        <div className="glass rounded-2xl border border-white/10 p-5 mb-5">
          <div className="flex flex-col gap-4 mb-5">
            <div>
              <label className="text-xs text-white/50 mb-2 block">레벨</label>
              <div className="flex gap-2">
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      level === l
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                        : "glass border border-white/10 text-white/60 hover:border-emerald-500/50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-2 block">주제</label>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                      topic === t
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                        : "glass border border-white/10 text-white/60 hover:border-emerald-500/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generateQuiz}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "문제 생성 중..." : "🎯 새 문제 생성"}
          </button>
        </div>

        {loading && (
          <div className="glass rounded-2xl border border-white/10 p-10 text-center">
            <div className="flex justify-center gap-2 mb-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-emerald-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-white/50 text-sm">
              AI가 문제를 만들고 있습니다...
            </p>
          </div>
        )}

        {quiz && !loading && (
          <div className="glass rounded-2xl border border-emerald-500/30 p-5 animate-fade-in-up bg-gradient-to-br from-emerald-500/10 to-green-600/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="level-badge text-white">{level}</span>
              <span className="text-xs text-white/40">{topic} 문제</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-5 leading-relaxed font-jp">
              {quiz.question}
            </h3>

            {quiz.options.length > 0 && (
              <div className="space-y-3 mb-5">
                {quiz.options.map((opt, i) => {
                  let btnClass =
                    "w-full p-4 rounded-xl text-left transition-all duration-200 border font-jp text-sm";
                  if (selected === null) {
                    btnClass +=
                      " glass border-white/10 text-white/80 hover:border-emerald-500/50 hover:text-white cursor-pointer active:scale-[0.99]";
                  } else if (i === quiz.answer) {
                    btnClass +=
                      " bg-emerald-500/20 border-emerald-500 text-emerald-300";
                  } else if (i === selected && i !== quiz.answer) {
                    btnClass += " bg-rose-500/20 border-rose-500 text-rose-300";
                  } else {
                    btnClass += " glass border-white/5 text-white/40";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={btnClass}
                    >
                      <span className="mr-3 font-bold">
                        {["①", "②", "③", "④"][i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {selected !== null && (
              <div
                className={`p-5 rounded-xl border ${
                  isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-rose-500/10 border-rose-500/30"
                }`}
              >
                <p className="font-bold mb-2 text-sm">
                  {isCorrect ? "✅ 정답입니다!" : "❌ 오답입니다"}
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  💡 {quiz.explanation}
                </p>
              </div>
            )}

            {selected !== null && (
              <button
                onClick={generateQuiz}
                className="mt-5 w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl text-white font-bold hover:shadow-lg transition-all duration-200"
              >
                다음 문제 →
              </button>
            )}
          </div>
        )}

        {!quiz && !loading && (
          <div className="text-center py-12 text-white/30">
            <div className="text-5xl mb-3">🧠</div>
            <p className="text-base">
              레벨과 주제를 선택하고 문제를 생성해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AuthButton from "@/components/AuthButton";

const features = [
  {
    id: "chat",
    icon: "💬",
    title: "AI 회화 연습",
    titleJP: "会話練習",
    desc: "Gemini AI와 실시간 일본어 대화를 나눠보세요",
    color: "from-pink-500/20 to-rose-600/20",
    border: "border-pink-500/30",
    href: "/chat",
    tag: "인기",
  },
  {
    id: "vocabulary",
    icon: "📚",
    title: "단어 학습",
    titleJP: "単語学習",
    desc: "AI가 예문과 함께 단어를 상세히 설명해드립니다",
    color: "from-violet-500/20 to-purple-600/20",
    border: "border-violet-500/30",
    href: "/vocabulary",
    tag: "",
  },
  {
    id: "grammar",
    icon: "✍️",
    title: "문법 마스터",
    titleJP: "文法マスター",
    desc: "복잡한 일본어 문법을 쉽고 명확하게 배워보세요",
    color: "from-blue-500/20 to-cyan-600/20",
    border: "border-blue-500/30",
    href: "/grammar",
    tag: "",
  },
  {
    id: "quiz",
    icon: "🧠",
    title: "AI 퀴즈",
    titleJP: "クイズ",
    desc: "내 레벨에 맞는 문제로 실력을 점검하세요",
    color: "from-emerald-500/20 to-green-600/20",
    border: "border-emerald-500/30",
    href: "/quiz",
    tag: "신규",
  },
  {
    id: "hiragana",
    icon: "🎌",
    title: "히라가나 학습",
    titleJP: "ひらがな",
    desc: "일본어의 기초! 히라가나를 완벽히 마스터하세요",
    color: "from-amber-500/20 to-orange-600/20",
    border: "border-amber-500/30",
    href: "/hiragana",
    tag: "기초",
  },
  {
    id: "translate",
    icon: "🔄",
    title: "AI 번역",
    titleJP: "翻訳",
    desc: "자연스러운 일본어 번역과 표현 팁을 받아보세요",
    color: "from-teal-500/20 to-cyan-600/20",
    border: "border-teal-500/30",
    href: "/translate",
    tag: "",
  },
];

const japaneseChars = [
  "あ",
  "い",
  "う",
  "え",
  "お",
  "か",
  "き",
  "く",
  "こ",
  "さ",
  "し",
  "す",
  "せ",
  "そ",
];

const centerStyle = { maxWidth: "64rem", margin: "0 auto", padding: "0 16px" };

export default function HomePage() {
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const fullText = "일본어를 AI와 함께 배워보세요";

  useEffect(() => {
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [charIndex, fullText]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-3xl" />
        {japaneseChars.map((char, i) => (
          <div
            key={i}
            className="absolute text-4xl font-bold text-white/5 select-none"
            style={{
              left: `${(i * 7.5) % 100}%`,
              top: `${(i * 13 + 10) % 90}%`,
              animationDelay: `${i * 0.5}s`,
              animation: `float${i % 3} ${4 + (i % 3)}s ease-in-out infinite`,
            }}
          >
            {char}
          </div>
        ))}
      </div>

      {/* 헤더 */}
      <header
        className="relative z-10 glass border-b border-white/10"
        style={{ width: "100%" }}
      >
        <div
          style={{
            ...centerStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xl font-bold shadow-lg flex-shrink-0">
              に
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">にほんご</h1>
              <p className="text-xs text-white/50">AI 일본어 학습</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 hidden sm:block">
              Powered by
            </span>
            <span className="text-xs font-semibold text-white/60 glass px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
              Gemini ✨
            </span>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative z-10" style={{ padding: "64px 16px" }}>
        <div
          style={{ maxWidth: "64rem", margin: "0 auto", textAlign: "center" }}
        >
          <div className="inline-block mb-6">
            <span className="glass px-4 py-2 rounded-full text-sm text-pink-300 border border-pink-500/30">
              🎌 Google Gemini AI 탑재
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="shimmer-text">
              {displayText}
              {charIndex < fullText.length && (
                <span className="animate-pulse text-pink-400">|</span>
              )}
            </span>
          </h2>
          <p className="text-lg text-white/60 mb-3 font-jp">
            AIと一緒に日本語を学びましょう！
          </p>
          <p
            className="text-sm text-white/40 mb-10 leading-relaxed"
            style={{ maxWidth: "36rem", margin: "0 auto 40px" }}
          >
            Gemini AI가 여러분의 일본어 선생님이 되어드립니다. 회화, 단어, 문법,
            퀴즈까지 모든 것을 한 곳에서 배우세요.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3">
            <Link
              href="/chat"
              className="w-full min-w-[180px] sm:w-auto whitespace-nowrap px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl font-bold text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:-translate-y-1 animate-pulse-glow text-center"
            >
              💬 AI와 대화 시작하기
            </Link>
            <Link
              href="/hiragana"
              className="w-full min-w-[180px] sm:w-auto whitespace-nowrap px-6 py-4 glass rounded-2xl font-bold text-white border border-white/20 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 text-center"
            >
              🎌 히라가나부터 시작
            </Link>
          </div>
        </div>
      </section>

      {/* 기능 그리드 */}
      <section
        className="relative z-10"
        style={{ ...centerStyle, paddingBottom: "64px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h3 className="text-xl font-bold text-white/80 mb-2">학습 메뉴</h3>
          <p className="text-white/40 text-sm">
            원하는 방법으로 일본어를 배워보세요
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <Link
              key={feature.id}
              href={feature.href}
              className={`card-hover glass rounded-2xl p-6 border ${feature.border} bg-gradient-to-br ${feature.color} group block relative`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {feature.tag && (
                <span className="level-badge text-white text-xs absolute top-4 right-4">
                  {feature.tag}
                </span>
              )}
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300 text-center mb-3">
                {feature.icon}
              </div>
              <h4 className="text-base font-bold text-white mb-0.5 text-center">
                {feature.title}
              </h4>
              <p className="text-xs text-white/40 font-jp mb-2 text-center">
                {feature.titleJP}
              </p>
              <p className="text-sm text-white/60 leading-relaxed text-center">
                {feature.desc}
              </p>
              <div className="mt-3 flex items-center justify-center gap-1 text-pink-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                시작하기 <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* JLPT 레벨 섹션 */}
      <section
        className="relative z-10"
        style={{ ...centerStyle, paddingBottom: "64px" }}
      >
        <div className="glass rounded-3xl p-6 border border-white/10">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h3 className="text-xl font-bold text-white/80 mb-1">
              JLPT 레벨 선택
            </h3>
            <p className="text-white/40 text-sm">
              레벨에 맞는 AI 학습 콘텐츠를 제공합니다
            </p>
          </div>
          <div className="grid grid-cols-5 gap-3 px-4">
            {["N5", "N4", "N3", "N2", "N1"].map((level, i) => {
              const colors = [
                "from-emerald-500 to-green-600",
                "from-blue-500 to-cyan-600",
                "from-violet-500 to-purple-600",
                "from-amber-500 to-orange-600",
                "from-pink-500 to-rose-600",
              ];
              const labels = ["입문", "초급", "중급", "상급", "최상급"];
              return (
                <Link
                  key={level}
                  href="/chat"
                  className={`card-hover bg-gradient-to-br ${colors[i]} rounded-2xl p-3 text-center shadow-lg`}
                >
                  <div className="text-lg sm:text-2xl font-black text-white mb-0.5">
                    {level}
                  </div>
                  <div className="text-xs text-white/80 hidden sm:block">
                    {labels[i]}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="relative z-10 text-center py-6 text-white/30 text-xs border-t border-white/5">
        <p>にほんご © 2025 · Powered by Google Gemini AI</p>
      </footer>

      <style jsx>{`
        @keyframes float0 {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float1 {
          0%,
          100% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(10px);
          }
        }
        @keyframes float2 {
          0%,
          100% {
            transform: translateY(5px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
}

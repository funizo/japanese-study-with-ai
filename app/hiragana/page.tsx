"use client";

import { useState } from "react";
import Link from "next/link";

const hiragana = [
  { char: "あ", romaji: "a" },
  { char: "い", romaji: "i" },
  { char: "う", romaji: "u" },
  { char: "え", romaji: "e" },
  { char: "お", romaji: "o" },
  { char: "か", romaji: "ka" },
  { char: "き", romaji: "ki" },
  { char: "く", romaji: "ku" },
  { char: "け", romaji: "ke" },
  { char: "こ", romaji: "ko" },
  { char: "さ", romaji: "sa" },
  { char: "し", romaji: "shi" },
  { char: "す", romaji: "su" },
  { char: "せ", romaji: "se" },
  { char: "そ", romaji: "so" },
  { char: "た", romaji: "ta" },
  { char: "ち", romaji: "chi" },
  { char: "つ", romaji: "tsu" },
  { char: "て", romaji: "te" },
  { char: "と", romaji: "to" },
  { char: "な", romaji: "na" },
  { char: "に", romaji: "ni" },
  { char: "ぬ", romaji: "nu" },
  { char: "ね", romaji: "ne" },
  { char: "の", romaji: "no" },
  { char: "は", romaji: "ha" },
  { char: "ひ", romaji: "hi" },
  { char: "ふ", romaji: "fu" },
  { char: "へ", romaji: "he" },
  { char: "ほ", romaji: "ho" },
  { char: "ま", romaji: "ma" },
  { char: "み", romaji: "mi" },
  { char: "む", romaji: "mu" },
  { char: "め", romaji: "me" },
  { char: "も", romaji: "mo" },
  { char: "や", romaji: "ya" },
  { char: "", romaji: "" },
  { char: "ゆ", romaji: "yu" },
  { char: "", romaji: "" },
  { char: "よ", romaji: "yo" },
  { char: "ら", romaji: "ra" },
  { char: "り", romaji: "ri" },
  { char: "る", romaji: "ru" },
  { char: "れ", romaji: "re" },
  { char: "ろ", romaji: "ro" },
  { char: "わ", romaji: "wa" },
  { char: "", romaji: "" },
  { char: "", romaji: "" },
  { char: "", romaji: "" },
  { char: "を", romaji: "wo" },
  { char: "ん", romaji: "n", wide: true },
];

const katakana = [
  { char: "ア", romaji: "a" },
  { char: "イ", romaji: "i" },
  { char: "ウ", romaji: "u" },
  { char: "エ", romaji: "e" },
  { char: "オ", romaji: "o" },
  { char: "カ", romaji: "ka" },
  { char: "キ", romaji: "ki" },
  { char: "ク", romaji: "ku" },
  { char: "ケ", romaji: "ke" },
  { char: "コ", romaji: "ko" },
  { char: "サ", romaji: "sa" },
  { char: "シ", romaji: "shi" },
  { char: "ス", romaji: "su" },
  { char: "セ", romaji: "se" },
  { char: "ソ", romaji: "so" },
  { char: "タ", romaji: "ta" },
  { char: "チ", romaji: "chi" },
  { char: "ツ", romaji: "tsu" },
  { char: "テ", romaji: "te" },
  { char: "ト", romaji: "to" },
  { char: "ナ", romaji: "na" },
  { char: "ニ", romaji: "ni" },
  { char: "ヌ", romaji: "nu" },
  { char: "ネ", romaji: "ne" },
  { char: "ノ", romaji: "no" },
  { char: "ハ", romaji: "ha" },
  { char: "ヒ", romaji: "hi" },
  { char: "フ", romaji: "fu" },
  { char: "ヘ", romaji: "he" },
  { char: "ホ", romaji: "ho" },
  { char: "マ", romaji: "ma" },
  { char: "ミ", romaji: "mi" },
  { char: "ム", romaji: "mu" },
  { char: "メ", romaji: "me" },
  { char: "モ", romaji: "mo" },
  { char: "ヤ", romaji: "ya" },
  { char: "", romaji: "" },
  { char: "ユ", romaji: "yu" },
  { char: "", romaji: "" },
  { char: "ヨ", romaji: "yo" },
  { char: "ラ", romaji: "ra" },
  { char: "リ", romaji: "ri" },
  { char: "ル", romaji: "ru" },
  { char: "レ", romaji: "re" },
  { char: "ロ", romaji: "ro" },
  { char: "ワ", romaji: "wa" },
  { char: "", romaji: "" },
  { char: "", romaji: "" },
  { char: "", romaji: "" },
  { char: "ヲ", romaji: "wo" },
  { char: "ン", romaji: "n", wide: true },
];

const centerStyle = { maxWidth: "42rem", margin: "0 auto", padding: "0 16px" };

export default function HiraganaPage() {
  const [tab, setTab] = useState<"hiragana" | "katakana">("hiragana");
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const chars = tab === "hiragana" ? hiragana : katakana;

  const toggleFlip = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
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
          <h1 className="font-bold text-white text-sm">🎌 문자 학습</h1>
        </div>
      </header>

      <div
        style={{ ...centerStyle, paddingTop: "24px", paddingBottom: "24px" }}
      >
        {/* 탭 & 컨트롤 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["hiragana", "katakana"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setFlipped(new Set());
              }}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                tab === t
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                  : "glass border border-white/10 text-white/60 hover:border-amber-500/50"
              }`}
            >
              {t === "hiragana" ? "ひらがな" : "カタカナ"}
              <span className="ml-1.5 text-xs opacity-70">
                {t === "hiragana" ? "히라가나" : "가타카나"}
              </span>
            </button>
          ))}
          <button
            onClick={() => setShowAll(!showAll)}
            className="ml-auto glass border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 hover:border-amber-500/50 transition-all"
          >
            {showAll ? "🙈 숨기기" : "👁️ 발음 보기"}
          </button>
        </div>

        <p className="text-white/40 text-xs mb-4 text-center">
          💡 카드를 탭하면 발음이 표시됩니다
        </p>

        {/* 문자 그리드 */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {chars.map((item, i) => {
            if (!item.char) {
              return <div key={i} />;
            }
            const isFlipped = flipped.has(i) || showAll;
            return (
              <button
                key={i}
                onClick={() => toggleFlip(i)}
                className={`card-hover glass rounded-xl p-4 text-center border transition-all duration-300 active:scale-95 ${
                  isFlipped
                    ? "border-amber-500/50 bg-gradient-to-br from-amber-500/15 to-orange-600/15"
                    : "border-white/10 hover:border-amber-500/30"
                } ${item.wide ? "col-span-2" : ""}`}
              >
                <div className="text-2xl font-bold text-white mb-1 font-jp">
                  {item.char}
                </div>
                <div
                  className={`text-xs font-mono transition-all duration-200 ${isFlipped ? "text-amber-400 opacity-100" : "text-transparent"}`}
                >
                  {item.romaji || "　"}
                </div>
              </button>
            );
          })}
        </div>

        {/* 정보 박스 */}
        <div className="flex flex-col gap-3">
          <div className="glass rounded-2xl border border-amber-500/20 p-4 bg-gradient-to-br from-amber-500/5 to-orange-600/5">
            <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2">
              📌 {tab === "hiragana" ? "히라가나" : "가타카나"}란?
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {tab === "hiragana"
                ? "히라가나(ひらがな)는 일본어의 기본 음절 문자로, 일본 고유어와 문법 요소를 표기하는 데 사용됩니다. 전체 46자로 구성되어 있습니다."
                : "가타카나(カタカナ)는 주로 외래어, 외국인 이름, 의성어를 표기하는 데 사용됩니다. 히라가나와 같은 발음이지만 다른 형태를 가집니다."}
            </p>
          </div>
          <div className="glass rounded-2xl border border-amber-500/20 p-4 bg-gradient-to-br from-amber-500/5 to-orange-600/5">
            <h3 className="text-white font-bold mb-2 text-sm">🎯 학습 팁</h3>
            <ul className="text-white/60 text-sm space-y-1.5">
              <li className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">▸</span>하루
                10자씩 플래시카드로 연습하세요
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">▸</span>자주
                보이는 단어부터 익히면 효과적입니다
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">▸</span>
                히라가나를 먼저 완성한 후 가타카나를 학습하세요
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">▸</span>AI 회화
                기능으로 실전 연습을 해보세요
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

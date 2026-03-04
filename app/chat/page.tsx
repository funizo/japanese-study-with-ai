"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "こんにちは！自己紹介をお願いします",
  "東京の観光スポットを教えてください",
  "日本の食べ物について話しましょう",
  "アニメが好きです。あなたは？",
  "天気はどうですか？",
];

const centerStyle = { maxWidth: "42rem", margin: "0 auto", padding: "0 16px" };

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `こんにちは！👋\n\n저는 AI 일본어 선생님입니다!\n\n일본어로 말을 걸어보세요. 틀린 표현이 있으면 친절하게 수정해드릴게요! 😊\n\n일본어: こんにちは！何でも聞いてください！\n발음: (こんにちは！なんでもきいてください！)\n한국어: [안녕하세요! 무엇이든 물어보세요!]`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          mode: "chat",
          level: "N3",
        }),
      });
      const data = await res.json();
      const aiMessage: Message = {
        role: "assistant",
        content: data.result || "죄송합니다. 응답을 가져오지 못했습니다.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ 오류가 발생했습니다. API 키를 확인해주세요.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          <h1 className="font-bold text-white text-sm">💬 AI 회화 연습</h1>
        </div>
      </header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto py-6" style={{ width: "100%" }}>
        <div style={centerStyle}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-br-md"
                    : "glass border border-white/10 text-white/90 rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      に
                    </div>
                    <span className="text-xs text-white/50">AI 선생님</span>
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content.split("**").map((part, j) =>
                    j % 2 === 1 ? (
                      <strong key={j} className="text-pink-300 font-bold">
                        {part}
                      </strong>
                    ) : (
                      part
                    ),
                  )}
                </div>
                <div className="text-xs mt-1.5 opacity-40">
                  {msg.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="glass border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/40">AI가 답변 중...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 추천 메시지 */}
      {messages.length === 1 && (
        <div style={{ ...centerStyle, paddingBottom: "8px" }}>
          <p className="text-xs text-white/40 mb-2">💡 이렇게 시작해보세요</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="glass border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white/70 hover:border-pink-500/50 hover:text-white transition-all duration-200 font-jp"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력창 */}
      <div className="glass border-t border-white/10" style={{ width: "100%" }}>
        <div style={{ ...centerStyle, padding: "12px 16px" }}>
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="일본어나 한국어로 입력하세요..."
              className="flex-1 glass border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 bg-transparent resize-none input-glow font-jp"
              rows={2}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          로딩 중...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}

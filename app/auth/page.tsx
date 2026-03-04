"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const supabase = createClient();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setShowEmailModal(true); // 이메일 인증 안내 팝업
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(
          "이메일 또는 비밀번호가 올바르지 않습니다. 이메일 인증이 완료됐는지 확인해주세요.",
        );
      } else {
        router.push("/");
        router.refresh();
      }
    }
    setLoading(false);
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
      {/* 이메일 인증 모달 */}
      {showEmailModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        >
          <div className="glass rounded-3xl border border-emerald-500/30 p-8 max-w-sm w-full mx-4 text-center animate-fade-in-up bg-gradient-to-br from-emerald-500/10 to-teal-600/10">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-white mb-3">
              이메일을 확인해주세요!
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-2">
              <span className="text-emerald-400 font-semibold">{email}</span>{" "}
              으로
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              인증 링크를 발송했습니다.
              <br />
              이메일의 링크를 클릭하면 로그인이 가능합니다.
            </p>
            <div className="glass rounded-xl border border-white/10 p-3 mb-6 text-xs text-white/40 leading-relaxed">
              📌 이메일이 오지 않으면 스팸함을 확인해주세요
            </div>
            <button
              onClick={() => {
                setShowEmailModal(false);
                setMode("login");
                setPassword("");
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200"
            >
              확인 — 로그인 화면으로
            </button>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <header
        className="glass border-b border-white/10 sticky top-0 z-10"
        style={{ width: "100%" }}
      >
        <div
          style={{
            maxWidth: "42rem",
            margin: "0 auto",
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
          <h1 className="font-bold text-white text-sm">
            {mode === "login" ? "🔐 로그인" : "✨ 회원가입"}
          </h1>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "28rem" }}>
          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg shadow-pink-500/30">
              に
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">にほんご</h2>
            <p className="text-white/40 text-sm">AI 일본어 학습 플랫폼</p>
          </div>

          {/* 탭 */}
          <div className="glass rounded-2xl border border-white/10 p-1 flex mb-6">
            <button
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                mode === "login"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white"
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                mode === "signup"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white"
              }`}
            >
              회원가입
            </button>
          </div>

          {/* 폼 */}
          <div className="glass rounded-2xl border border-white/10 p-6">
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                  placeholder="example@email.com"
                  className="w-full glass border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 bg-transparent input-glow text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                  placeholder={
                    mode === "signup" ? "6자 이상 입력" : "비밀번호 입력"
                  }
                  className="w-full glass border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 bg-transparent input-glow text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-rose-500/20 border border-rose-500/30 text-rose-300">
                {error}
              </div>
            )}

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading
                ? "처리 중..."
                : mode === "login"
                  ? "로그인"
                  : "회원가입"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

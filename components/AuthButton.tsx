"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // 버튼·드롭다운 둘 다 외부면 닫기
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !dropRef.current?.contains(t)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.refresh();
  };

  return (
    <>
      {/* 데스크톱 */}
      <div className="hidden sm:flex items-center gap-2">
        {user ? (
          <>
            <Link
              href="/saved"
              className="text-xs glass border border-white/10 px-3 py-1.5 rounded-full text-white/60 hover:text-white hover:border-violet-500/50 transition-all duration-200"
            >
              🔖 저장 목록
            </Link>
            <span className="text-xs text-white/40 max-w-[100px] truncate">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs glass border border-white/10 px-3 py-1.5 rounded-full text-white/60 hover:text-white hover:border-pink-500/50 transition-all duration-200"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-200"
          >
            로그인
          </Link>
        )}
      </div>

      {/* 모바일 햄버거 버튼 */}
      <div className="sm:hidden">
        <button
          ref={btnRef}
          onClick={() => setMenuOpen((v) => !v)}
          className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 glass border border-white/10 rounded-xl transition-all duration-200"
        >
          <span
            className={`block w-4 h-0.5 bg-white/70 rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-4 h-0.5 bg-white/70 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-4 h-0.5 bg-white/70 rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* 드롭다운 — document.body에 Portal로 마운트 (헤더 CSS 영향 완전 차단) */}
      {mounted &&
        menuOpen &&
        createPortal(
          <div
            ref={dropRef}
            style={{
              position: "fixed",
              top: "56px",
              right: "16px",
              width: "192px",
              zIndex: 99999,
              background: "#0d0d14",
              border: "1px solid #374151",
              borderRadius: "16px",
              padding: "8px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.9)",
            }}
          >
            {user ? (
              <>
                <p
                  style={{
                    padding: "8px 12px 8px",
                    fontSize: "12px",
                    color: "#9ca3af",
                    borderBottom: "1px solid #374151",
                    marginBottom: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </p>
                <Link
                  href="/saved"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    color: "#e5e7eb",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#1f2937")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  🔖 저장 목록
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    color: "#e5e7eb",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4c1d24";
                    e.currentTarget.style.color = "#fca5a5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#e5e7eb";
                  }}
                >
                  🚪 로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  color: "white",
                  fontWeight: 600,
                  textDecoration: "none",
                  background: "linear-gradient(to right, #ec4899, #e11d48)",
                }}
              >
                🔐 로그인 / 회원가입
              </Link>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

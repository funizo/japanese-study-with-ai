"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50 hidden sm:block max-w-[120px] truncate">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs glass border border-white/10 px-3 py-1.5 rounded-full text-white/60 hover:text-white hover:border-pink-500/50 transition-all duration-200"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth"
      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-200"
    >
      로그인
    </Link>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/gemini";
import { createClient } from "@supabase/supabase-js";

// Supabase 서비스 롤 클라이언트 (RLS 우회 가능)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const levels = ["N5", "N4", "N3", "N2", "N1"];

const wordPrompt = (level: string) =>
  `JLPT ${level} 수험생이 반드시 알아야 할 핵심 단어 50개를 선정해주세요.
다음 JSON 배열 형식으로만 응답하세요 (마크다운, 코드블록 없이 순수 JSON만):
[{"word":"일본어단어","reading":"히라가나","meaning":"한국어뜻","category":"동사/명사/い형용사/な형용사/부사/표현","example":"예문(일본어)","example_kr":"예문한국어번역"}]
반드시 50개, ${level} 레벨 시험 출제 빈도 높은 단어 위주.`;

const grammarPrompt = (level: string) =>
  `JLPT ${level} 수험생이 반드시 알아야 할 핵심 문법 10개를 선정해주세요.
다음 JSON 배열 형식으로만 응답하세요 (마크다운, 코드블록 없이 순수 JSON만):
[{"pattern":"문법패턴","meaning":"한국어의미/용법","usage":"접속방법","example":"예문(일본어)","example_reading":"예문히라가나","example_kr":"예문한국어번역","difficulty":"필수/중요/심화"}]
반드시 10개, ${level} 레벨 출제 빈도 높은 문법 위주.`;

async function generateAndSave(
  level: string,
  type: "words" | "grammar",
  date: string,
) {
  const prompt = type === "words" ? wordPrompt(level) : grammarPrompt(level);
  const mode = type === "words" ? "level-words" : "level-grammar";

  // 이미 오늘 데이터 존재하면 스킵
  const { data: existing } = await supabaseAdmin
    .from("daily_content")
    .select("id")
    .eq("level", level)
    .eq("type", type)
    .eq("date", date)
    .maybeSingle();

  if (existing) return { level, type, status: "skipped" };

  const raw = await sendMessage(prompt);
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return { level, type, status: "parse_error" };

  const content = JSON.parse(match[0]);
  const { error } = await supabaseAdmin.from("daily_content").insert({
    level,
    type,
    content,
    date,
  });

  return { level, type, status: error ? "db_error" : "ok", error };
}

export async function GET(req: NextRequest) {
  // Vercel Cron 시크릿 검증
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 한국 날짜 (UTC+9)
  const kstDate = new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // 5레벨 × 2타입 = 10개 병렬 생성
  const tasks = levels.flatMap((level) => [
    generateAndSave(level, "words", kstDate),
    generateAndSave(level, "grammar", kstDate),
  ]);

  const results = await Promise.allSettled(tasks);
  const summary = results.map((r) =>
    r.status === "fulfilled" ? r.value : { status: "error", reason: r.reason },
  );

  return NextResponse.json({ date: kstDate, results: summary });
}

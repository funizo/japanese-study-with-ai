import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, mode, level } = await req.json();

    let systemPrompt = "";

    if (mode === "chat") {
      systemPrompt = `당신은 친절한 일본어 선생님입니다. 학습자의 레벨은 "${level}"입니다.
학습자가 일본어로 말하면 자연스럽게 일본어로 대화하고, 한국어로 말하면 일본어 번역과 함께 도움을 줍니다.
잘못된 일본어 표현이 있으면 친절하게 수정해주세요.
응답 형식: 일본어 답변 + (히라가나 발음) + [한국어 번역]
학습자 메시지: ${message}`;
    } else if (mode === "vocabulary") {
      systemPrompt = `일본어 단어 "${message}"에 대해 다음 형식으로 설명해주세요:
1. 단어: (일본어)
2. 읽기: (히라가나/가타카나)
3. 한국어 의미: 
4. 예문 3개: (일본어 + 히라가나 + 한국어 번역)
5. 관련 단어: 
레벨: ${level}`;
    } else if (mode === "grammar") {
      systemPrompt = `일본어 문법 "${message}"에 대해 다음 형식으로 설명해주세요:
1. 문법 패턴:
2. 의미/용법:
3. 핵심 설명:
4. 예문 4개: (일본어 + 히라가나 + 한국어 번역)
5. 주의사항:
6. 비슷한 문법:
레벨: ${level}`;
    } else if (mode === "quiz") {
      systemPrompt = `일본어 ${level} 레벨 퀴즈를 1문제 출제해주세요.
주제: "${message}"
다음 JSON 형식으로만 응답하세요 (마크다운 없이):
{
  "question": "문제",
  "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
  "answer": 0,
  "explanation": "해설"
}
answer는 0부터 시작하는 인덱스입니다.`;
    } else if (mode === "translate") {
      systemPrompt = `다음 텍스트를 일본어로 번역해주세요. 
원문: "${message}"
다음 형식으로 응답하세요:
1. 번역: (일본어)
2. 읽기: (히라가나)
3. 직역: (한국어)
4. 자연스러운 표현 팁:`;
    } else if (mode === "recommend-vocabulary") {
      systemPrompt = `일본어 ${level} 레벨 학습자에게 꼭 필요한 단어 5개를 추천해주세요.
다음 JSON 형식으로만 응답하세요 (마크다운, 코드블록 없이 순수 JSON만):
[
  {"word": "일본어단어", "reading": "히라가나", "meaning": "한국어뜻", "category": "카테고리"},
  {"word": "일본어단어", "reading": "히라가나", "meaning": "한국어뜻", "category": "카테고리"},
  {"word": "일본어단어", "reading": "히라가나", "meaning": "한국어뜻", "category": "카테고리"},
  {"word": "일본어단어", "reading": "히라가나", "meaning": "한국어뜻", "category": "카테고리"},
  {"word": "일본어단어", "reading": "히라가나", "meaning": "한국어뜻", "category": "카테고리"}
]
카테고리는 동사/명사/형용사/부사/표현 중 하나입니다. ${level} 레벨에 적합한 단어만 선택하세요.`;
    } else if (mode === "recommend-grammar") {
      systemPrompt = `일본어 ${level} 레벨 학습자에게 중요한 문법 패턴 5개를 추천해주세요.
다음 JSON 형식으로만 응답하세요 (마크다운, 코드블록 없이 순수 JSON만):
[
  {"pattern": "문법패턴", "meaning": "한국어의미", "example": "짧은예문", "difficulty": "난이도"},
  {"pattern": "문법패턴", "meaning": "한국어의미", "example": "짧은예문", "difficulty": "난이도"},
  {"pattern": "문법패턴", "meaning": "한국어의미", "example": "짧은예문", "difficulty": "난이도"},
  {"pattern": "문법패턴", "meaning": "한국어의미", "example": "짧은예문", "difficulty": "난이도"},
  {"pattern": "문법패턴", "meaning": "한국어의미", "example": "짧은예문", "difficulty": "난이도"}
]
difficulty는 필수/중요/심화 중 하나입니다. ${level} 레벨에 적합한 문법만 선택하세요.`;
    }

    const response = await sendMessage(systemPrompt);
    return NextResponse.json({ result: response });
  } catch {
    return NextResponse.json(
      { error: "AI 응답 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}

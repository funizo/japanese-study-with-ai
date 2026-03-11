# にほんご — AI 일본어 학습 플랫폼

> Google Gemini AI와 함께하는 스마트 일본어 학습 서비스

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?logo=supabase)
![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?logo=google)

---

## 📖 소개

**にほんご**는 Google Gemini AI 기반의 일본어 학습 웹 애플리케이션입니다.
회화 연습, 매일 업데이트되는 단어 및 문법 학습, 퀴즈, 히라가나 학습까지 하나의 플랫폼에서 제공합니다.
사용자는 로그인 후 학습한 단어와 문법을 저장하여 언제든 간편하게 복습할 수 있습니다.

특히 **Vercel Cron Job**과 **Supabase**를 활용하여, 매일 오전 AI가 새로운 JLPT 레벨별 맞춤 콘텐츠를 자동으로 생성하여 사용자에게 제공합니다.

> 🎵 이 프로젝트는 **바이브코딩(Vibe Coding)** 방식으로 처음 제작되었습니다.
> AI와 함께 아이디어를 즉흥적으로 구현해나가며 완성한 프로젝트입니다.

---

## ✨ 주요 기능

| 기능                  | 설명                                                                                |
| --------------------- | ----------------------------------------------------------------------------------- |
| 📅 **오늘의 학습**    | Vercel Cron을 통해 매일 갱신되는 JLPT 레벨별 맞춤 단어 및 문법 학습 (Supabase 캐싱) |
| 💬 **AI 회화 연습**   | Gemini AI와 실시간 일본어 대화                                                      |
| 📚 **단어·문법 검색** | 검색한 단어나 문법에 대해 AI가 예문·독음·의미를 상세히 분석 및 설명                 |
| 🧠 **AI 퀴즈**        | JLPT 레벨별 맞춤 퀴즈 자동 생성                                                     |
| 🎌 **히라가나 학습**  | 히라가나·가타카나 발음 및 표기 학습                                                 |
| ⭐ **저장 목록**      | 학습 중 저장한 단어 및 문법 데이터를 한곳에서 모아보기 및 복습                      |
| 🌐 **일본어 입력**    | 지원되는 입력창에서 로마자를 일본어로 자동 변환 (`taberu` → `たべる`)               |

---

## 🛠️ 기술 스택

### Frontend

- **[Next.js 16](https://nextjs.org/)** — App Router, Server/Client Components
- **[Tailwind CSS v4](https://tailwindcss.com/)** — 유틸리티 기반 반응형 스타일링
- **[wanakana](https://wanakana.com/)** — 로마자 → 히라가나/가타카나 실시간 변환 라이브러리

### Backend & AI

- **[Google Gemini AI](https://ai.google.dev/)** — AI 회화, 단어·문법 해설 제공 및 퀴즈 자동 생성
- **[Supabase](https://supabase.com/)** — 계정 인증 시스템 및 학습 데이터(저장 목록, Daily 콘텐츠) 저장을 위한 PostgreSQL 데이터베이스
- **Vercel Cron Jobs** — 매일 정해진 시간(오전 6시)에 API를 호출해 Gemini AI로 새로운 학습 데이터를 만들고 DB에 업데이트

---

## 📁 프로젝트 구조

```text
app/
├── page.tsx             # 메인 홈 페이지
├── auth/                # 로그인 및 회원가입
├── learn/[level]/       # 매일 갱신되는 JLPT 레벨별 오늘의 단어/문법 학습
├── chat/                # AI 회화 연습
├── vocabulary/          # 일본어 단어 검색 및 상세 학습
├── grammar/             # 일본어 문법 검색 및 해설
├── quiz/                # AI JLPT 퀴즈
├── hiragana/            # 히라가나 및 가타카나 학습
├── saved/               # 사용자가 북마크한 단어/문법 저장 목록
├── api/generate-daily/  # Vercel Cron Job으로 매일 학습 데이터를 생성하는 라우트
└── api/chat/            # Gemini AI 챗봇 API 라우트

components/
└── AuthButton.tsx       # 사용자 로그인/로그아웃 상태 UI

lib/
├── gemini.ts            # Gemini AI 클라이언트 설정 및 유틸 함수
└── supabase.ts          # Supabase 클라이언트 설정 및 DB 접근 레이어
```

---

## 📄 라이선스

MIT License

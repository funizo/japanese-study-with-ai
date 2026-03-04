# にほんご — AI 일본어 학습 플랫폼

> Google Gemini AI와 함께하는 스마트 일본어 학습 서비스

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?logo=supabase)
![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?logo=google)

---

## 📖 소개

**にほんご**는 Google Gemini AI 기반의 일본어 학습 웹 애플리케이션입니다.
회화 연습, 단어 학습, 문법 학습, 퀴즈, 히라가나 학습까지 하나의 플랫폼에서 제공합니다.
회원가입 후 학습한 단어와 문법을 저장해 언제든 복습할 수 있습니다.

> 🎵 이 프로젝트는 **바이브코딩(Vibe Coding)** 방식으로 처음 제작되었습니다.
> AI와 함께 아이디어를 즉흥적으로 구현해나가며 완성한 프로젝트입니다.

---

## ✨ 주요 기능

| 기능                 | 설명                                       |
| -------------------- | ------------------------------------------ |
| 💬 **AI 회화 연습**  | Gemini AI와 실시간 일본어 대화             |
| 📚 **단어 학습**     | 단어 검색 시 AI가 예문·독음·의미 상세 설명 |
| ✍️ **문법 마스터**   | 일본어 문법 패턴 검색 및 AI 상세 분석      |
| 🧠 **AI 퀴즈**       | JLPT 레벨별 맞춤 퀴즈 자동 생성            |
| 🎌 **히라가나 학습** | 히라가나·가타카나 발음 학습                |
| ⭐ **저장 목록**     | 학습한 단어·문법 저장 및 복습              |
| 🌐 **일본어 입력**   | 로마자 자동 변환 (`taberu` → `たべる`)     |

---

## 🛠️ 기술 스택

### Frontend

- **[Next.js 16](https://nextjs.org/)** — App Router, Server/Client Components
- **[Tailwind CSS v4](https://tailwindcss.com/)** — 유틸리티 기반 스타일링
- **[wanakana](https://wanakana.com/)** — 로마자 → 히라가나/가타카나 실시간 변환

### Backend & AI

- **[Google Gemini AI](https://ai.google.dev/)** (`gemini-3-flash-preview`) — 대화·단어·문법·퀴즈 생성
- **[Supabase](https://supabase.com/)** — PostgreSQL 데이터베이스 + 사용자 인증

---

## 📁 프로젝트 구조

```
app/
├── page.tsx          # 홈 페이지
├── auth/             # 로그인 / 회원가입
├── chat/             # AI 회화 연습
├── vocabulary/       # 단어 학습
├── grammar/          # 문법 마스터
├── quiz/             # AI 퀴즈
├── hiragana/         # 히라가나 학습
├── saved/            # 저장 목록
└── api/chat/         # Gemini AI API 라우트

components/
└── AuthButton.tsx    # 로그인 상태 표시 컴포넌트

lib/
├── gemini.ts         # Gemini AI 클라이언트
└── supabase.ts       # Supabase 클라이언트
```

---

## 📄 라이선스

MIT License

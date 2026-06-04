# AGENTS.md

## 프로젝트 규칙

- 기술스택은 Next.js, TypeScript, Tailwind CSS, App Router를 기본으로 한다.
- 실제 사람인 API, 크롤링, Supabase 연동은 별도 지시 전까지 추가하지 않는다.
- MVP 단계에서는 `src/data/mockJobs.ts` 데이터를 기준으로 화면을 구현한다.
- TypeScript 타입을 먼저 명확히 정의하고, 컴포넌트 props에도 타입을 붙인다.
- UI는 대시보드 첫 화면을 우선한다. 랜딩 페이지나 마케팅 섹션을 만들지 않는다.
- 컴포넌트는 책임별로 작게 나눈다.
  - `DashboardSummary`
  - `JobFilter`
  - `JobCard`
  - `TechStackBadge`
- 필터 동작은 클라이언트 상태로 단순하게 유지한다.
- 문서는 구현에 필요한 만큼만 짧게 작성한다.
- 사용자가 요청하지 않은 인증, DB, 배치 작업, 외부 API 연동을 추가하지 않는다.

## 코드 스타일

- 앱 코드는 `src` 아래에 둔다.
- 데이터 타입은 `src/types`에 둔다.
- mock 데이터는 `src/data`에 둔다.
- 화면 로직 중 재사용 가능한 계산은 `src/lib`에 둔다.
- 접근성과 모바일 레이아웃을 기본으로 확인한다.

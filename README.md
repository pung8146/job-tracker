# Job Tracker

개발자 채용공고를 매일 모아 신규 공고, AI 관련 공고, 기술스택, 마감 임박 공고를 확인하는 개인 취업 대시보드입니다.

## 기술스택

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- SQLite

## MVP 기능

- 메인 대시보드
- 전체/신규/AI 관련/마감 임박 통계 카드
- mock 데이터 또는 수집 데이터 기반 공고 카드 리스트
- 키워드, AI 관련, 신규 공고 필터
- 기술스택 태그와 관심 등록 버튼 UI

## 실행

```bash
npm install
npm run dev
```

## 로컬 DB

```bash
npm run db:init
```

SQLite DB는 `data/job-tracker.db`에 생성되며 git에는 올리지 않습니다.

## 수집 준비

사람인 API 승인 후 `.env.local`에 키를 넣습니다.

```bash
SARIMIN_ACCESS_KEY=발급받은_키
```

수집 테스트:

```bash
npm run collect:saramin -- AI
```

## 향후 계획

- 사람인 수집 결과를 SQLite에 저장
- 대시보드가 SQLite에서 공고 읽기
- 관심 공고 저장과 지원 상태 관리
- 일일 요약, 마감 임박 알림, 자동 리포트

## 문서

- [PRD](docs/PRD.md)
- [데이터 모델](docs/DATA_MODEL.md)
- [데이터 수집 설계](docs/COLLECTION_PLAN.md)
- [로컬 DB 설계](docs/LOCAL_DB.md)

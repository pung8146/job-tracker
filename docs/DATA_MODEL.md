# 데이터 모델 초안

## 목표

채용공고 원본을 여러 출처에서 모아도 대시보드에서는 같은 형태로 다루게 만든다. Supabase 연동 전까지는 이 문서를 기준으로 mock 데이터와 향후 DB 스키마를 맞춘다.

## 핵심 엔티티

### JobPosting

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | string | 내부 공고 ID |
| `source` | string | 출처. 예: `Saramin`, `Wanted`, `JobKorea` |
| `sourceJobId` | string | 출처가 제공하는 원본 공고 ID |
| `url` | string | 원본 공고 URL |
| `title` | string | 공고 제목 |
| `company` | string | 회사명 |
| `location` | string | 근무 지역 |
| `experience` | string | 경력 조건 |
| `employmentType` | string | 고용 형태 |
| `deadline` | string | 마감일. `YYYY-MM-DD` |
| `keywords` | string[] | 분류 키워드. 예: `AI`, `Frontend`, `Backend` |
| `techStacks` | string[] | 기술스택 태그 |
| `isAiRelated` | boolean | AI 관련 공고 여부 |
| `isNew` | boolean | 이번 수집에서 새로 발견된 공고 여부 |
| `collectedAt` | string | 수집일. `YYYY-MM-DD` |
| `firstSeenAt` | string | 처음 발견한 날짜 |
| `lastSeenAt` | string | 마지막으로 확인한 날짜 |
| `status` | string | `open`, `closed`, `expired`, `unknown` |

## 관심 공고

### FavoriteJob

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `jobId` | string | 관심 등록한 공고 ID |
| `createdAt` | string | 등록 시각 |
| `memo` | string | 개인 메모 |
| `applicationStatus` | string | `saved`, `applied`, `interview`, `rejected`, `offer` |

## 중복 판단 기준

1. 같은 `source`와 같은 `sourceJobId`면 같은 공고다.
2. `sourceJobId`가 없으면 `company + title + deadline + location`을 정규화해 비교한다.
3. 제목이 조금 달라도 원본 URL이 같으면 같은 공고로 본다.

## AI 관련 판정

초기에는 규칙 기반으로 판정한다.

- 제목, 키워드, 직무 설명에 다음 단어가 있으면 AI 관련 후보로 본다.
- `AI`, `LLM`, `ML`, `Machine Learning`, `Deep Learning`, `MLOps`, `NLP`, `Computer Vision`, `Prompt`

나중에는 공고 설명 전체를 저장한 뒤 LLM 분류나 임베딩 검색으로 개선한다.

## 기술스택 추출

초기에는 사전 기반 매칭을 사용한다.

- Frontend: `TypeScript`, `JavaScript`, `React`, `Next.js`, `Vue`, `Tailwind CSS`
- Backend: `Node.js`, `Python`, `Java`, `Spring`, `FastAPI`, `NestJS`
- Data/AI: `Python`, `PyTorch`, `TensorFlow`, `LangChain`, `Kubernetes`, `AWS`
- Database: `PostgreSQL`, `MySQL`, `MongoDB`, `Redis`

## 저장 우선순위

1. 원본 공고 ID와 URL
2. 제목, 회사명, 마감일
3. 지역, 경력, 고용형태
4. 키워드, 기술스택, AI 관련 여부
5. 개인 상태와 메모

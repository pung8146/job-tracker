# 로컬 DB 설계

## 방향

Job Tracker는 우선 로컬 SQLite DB에 공고와 수집 이력을 저장한다. 개인용 대시보드라 외부 DB 없이 `data/job-tracker.db` 파일 하나로 시작한다.

## 실행

```bash
npm run db:init
npm run db:seed
```

생성 파일:

```text
data/job-tracker.db
```

DB 파일은 개인 로컬 데이터라 git에 올리지 않는다.

`npm run db:seed`는 mock 공고를 SQLite에 넣어 API 승인 전에도 DB 기반 대시보드 흐름을 확인할 수 있게 한다.

## 테이블

### jobs

채용공고 표준 데이터.

- `id`: 내부 공고 ID
- `source`: 출처. 예: `Saramin`
- `source_job_id`: 출처 원본 공고 ID
- `url`: 원본 공고 URL
- `title`, `company`, `location`, `experience`, `employment_type`
- `deadline`
- `keywords_json`, `tech_stacks_json`
- `is_ai_related`, `is_new`
- `collected_at`, `first_seen_at`, `last_seen_at`
- `status`

### collection_runs

수집 실행 기록.

- 출처, 키워드, 수집일
- 총 공고 수, 신규 공고 수, AI 관련 공고 수, 마감 임박 수
- 성공/실패 상태와 오류 메시지

### favorite_jobs

관심 공고와 개인 상태.

- `job_id`
- `memo`
- `application_status`: `saved`, `applied`, `interview`, `rejected`, `offer`

## 다음 단계

1. 사람인 수집 결과를 JSON뿐 아니라 SQLite에 저장한다.
2. 대시보드가 SQLite에서 공고를 읽게 한다.
3. 관심 등록 버튼을 SQLite에 저장한다.

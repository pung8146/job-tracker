# 데이터 수집 설계

## 목표

매일 개발자 채용공고를 수집해 신규 공고, AI 관련 공고, 기술스택, 마감 임박 공고를 대시보드에서 볼 수 있게 한다. 실제 API 응답 구조는 raw 저장 후 검증한다.

## 출처 우선순위

### 1. 사람인

사람인은 공식 채용공고 API를 우선 검토한다. 현재 문서 기준으로 `GET https://oapi.saramin.co.kr/job-search` 채용공고 검색 API가 있으며, 이용신청과 `access-key` 발급이 필요하다. 호출 제한이 있으므로 매일 필요한 키워드만 좁혀 요청한다.

초기 검색 키워드 후보:

- `프론트엔드`
- `백엔드`
- `풀스택`
- `TypeScript`
- `React`
- `Next.js`
- `AI`
- `LLM`

### 2. 잡코리아

잡코리아는 공개 XML API 흔적이 있으나 최신 운영 상태와 이용 조건 확인이 필요하다. 공식 문서나 신청 절차가 확인되면 API 방식으로 붙이고, 불명확하면 MVP 이후 보류한다.

### 3. 원티드

원티드는 공식 공개 채용공고 API가 명확하지 않다. 약관과 robots 정책 확인 전까지 자동 수집 대상으로 두지 않는다. 초기에는 수동 북마크 또는 CSV 가져오기 후보로 둔다.

## 수집 흐름

1. 매일 정해진 시간에 수집 작업 시작
2. 출처별 수집기 실행
3. 원본 응답을 `data/raw`에 저장
4. raw 샘플을 기준으로 normalizer 검증
5. 원본 응답을 표준 `JobPosting` 형태로 변환
6. 중복 공고 병합
7. 신규 공고 여부 계산
8. AI 관련 여부와 기술스택 태그 계산
9. 마감일 기준 상태 갱신
10. JSON 또는 SQLite에 저장
11. 수집 결과 요약 기록

## 수집기 구조

```text
collector/
  saraminCollector
  jobkoreaCollector
  manualImportCollector

normalizer/
  normalizeSaraminJob
  normalizeJobkoreaJob

classifier/
  detectAiRelated
  extractTechStacks
  calculateJobStatus
```

## 환경 변수 후보

```bash
SARIMIN_ACCESS_KEY=
JOBKOREA_API_KEY=
```

## 원본 응답 저장

실제 API 응답 구조가 문서와 다를 수 있으므로 DB 저장 전에 원본 응답을 먼저 저장한다.

```bash
npm run collect:saramin:raw -- AI
```

저장 위치:

```text
data/raw/saramin-YYYY-MM-DD-AI.json
```

`data/raw`는 로컬 검증용이므로 git에 올리지 않는다.

## 실패 처리

- API 호출 실패 시 출처별 오류를 기록하고 다음 출처 수집은 계속한다.
- 같은 공고가 이미 있으면 `lastSeenAt`만 갱신한다.
- 마감일 파싱 실패 시 `status`를 `unknown`으로 둔다.
- 호출 제한에 걸리면 해당 출처는 그날 추가 호출하지 않는다.

## 단계별 구현 계획

1. 데이터 모델 문서와 mock 데이터 필드 맞추기
2. 사람인 API 키 발급과 raw 응답 저장
3. 실제 raw 응답 기반 normalizer 테스트 보강
4. 중복 판단 함수와 신규 공고 계산 함수 작성
5. SQLite 저장 함수 작성
6. 일일 수집 작업 추가
7. 원티드/잡코리아는 정책과 공식 API 확인 후 추가

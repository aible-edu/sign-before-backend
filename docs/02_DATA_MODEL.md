# 사인전에 — 데이터 모델

> 이 문서는 앱에서 다루는 핵심 데이터의 구조를 정의합니다.
> **서버 미저장 원칙**: 계약서 이미지와 분석 결과는 기기 AsyncStorage에만 저장됩니다.
> Claude API 처리 후 서버에 데이터가 남지 않습니다.

---

## 전체 구조

```
[ConsentRecord] ─── 앱 설치 시 1회 기록
[DailyUsage] ─────── 날짜별 사용량 추적
      │
      └──관련──▶ [AnalysisSession] ─── 1:1 ───▶ [AnalysisResult]
```

모든 데이터는 **기기 내 AsyncStorage**에 저장됩니다. 서버 DB 없음.

---

## 엔티티 상세

### AnalysisSession (분석 세션)
"계약서 한 번 분석"을 기록하는 단위.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| id | 고유 식별자 (UUID 자동 생성) | `a3f8-12bc-...` | O |
| contractType | 계약서 유형 | `'lease'` (임대차, Phase1 고정) | O |
| imageUri | 마스킹된 이미지 임시 경로 (분석 후 삭제) | `file:///...masked.jpg` | O |
| createdAt | 분석 요청 시각 (ISO 8601) | `2026-03-15T14:30:00+09:00` | O |
| status | 처리 상태 | `analyzing` / `done` / `failed` | O |

> `imageUri`는 Claude API 전송 후 즉시 기기에서 삭제됩니다 (1회성 처리 원칙).

---

### AnalysisResult (분석 결과)
3카드 화면에 표시되는 분석 결과. AnalysisSession과 1:1 관계.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| sessionId | 연결된 세션 ID (FK) | `a3f8-12bc-...` | O |
| summary | 핵심 요약 카드 텍스트 | `"임대기간 2년, 보증금 3,000만원..."` | O |
| riskClauses | 위험 조항 목록 (배열) | `["묵시적 갱신 조항 있음", "수리비 임차인 부담"]` | O |
| checklist | 서명 전 체크리스트 (배열) | `["등기부등본 확인", "특약사항 재검토"]` | O |
| modelUsed | 사용된 Claude 모델 버전 | `claude-sonnet-4-6` | O |

---

### ConsentRecord (국외이전 동의 기록)
앱 최초 실행 시 1회 기록. 개인정보보호법 국외이전 동의 증빙.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| consentedAt | 동의 시각 (ISO 8601) | `2026-03-15T09:00:00+09:00` | O |
| consentVersion | 동의서 버전 (정책 변경 시 재동의 트리거) | `v1.0` | O |
| transferTarget | 이전 대상 정보 | `Anthropic Inc., USA` | O |
| retentionPeriod | 보존 기간 고지 내용 | `7일 후 자동 삭제` | O |

> 동의 기록이 없으면 분석 기능 비활성화. 동의 버전이 다르면 재동의 요청.

---

### DailyUsage (일일 사용량)
무료 횟수 제한 관리. Phase 1에서는 광고 없이 무제한 → Phase 2에서 일 3회 제한 도입.

| 필드 | 설명 | 예시 | 필수 |
|------|------|------|------|
| date | 날짜 (YYYY-MM-DD) | `2026-03-15` | O |
| usageCount | 오늘 분석 횟수 | `2` | O |
| freeQuota | 무료 한도 (Phase 2 도입 시 3) | `999` (Phase1 무제한) | O |

---

## 관계 정리

```
ConsentRecord
  └── 앱 당 1개 (최초 동의 1회)

DailyUsage
  └── 날짜별 1개 레코드

AnalysisSession (1) ─── (1) AnalysisResult
  └── 세션 1개당 결과 1개
  └── 이미지는 분석 후 로컬에서 삭제
```

---

## 왜 이 구조인가

### 서버 DB 없음 — AsyncStorage 단일 저장소
- 개인정보보호법(PIPA) 국외이전 리스크를 최소화하기 위해 계약서 이미지·분석 결과를 서버에 저장하지 않음
- 토스 미니앱 구조상 백엔드는 Claude API 중계 역할만 수행 (Flask 서버 stateless)
- Phase 3에서 클라우드 백업 기능 추가 시 별도 동의 절차 필요

### 확장성
- `contractType` 필드를 enum으로 관리 → Phase 2에서 `'labor'`(근로), `'freelance'`(프리랜서) 추가 시 기존 구조 유지
- `consentVersion`으로 정책 변경 시 재동의 트리거 — 앱 업데이트 없이 처리 가능

### 단순성
- 사용자 ID 필드 없음: 토스 계정 인증은 앱인토스 프레임워크가 처리, 앱 레벨에서 별도 관리 불필요
- 이미지 원본 저장 없음: 마스킹된 임시 파일만 사용 후 즉시 삭제

---

## [NEEDS CLARIFICATION]

- [ ] **AsyncStorage 용량 제한**: 이력이 쌓일 경우 오래된 세션 자동 삭제 정책 미정 (최근 20개 보관 등)
- [ ] **마스킹 이미지 삭제 시점**: API 응답 수신 직후 즉시 삭제 vs 결과 화면 이탈 시 삭제
- [ ] **DailyUsage 리셋 기준**: 자정(00:00 KST) 기준 vs 24시간 슬라이딩 윈도우

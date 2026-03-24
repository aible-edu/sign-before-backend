# 사인전에 — 디자인 문서

> Show Me The PRD + kkirikkiri 사전 조사 팀으로 생성됨 (2026-03-15)
> 앱인토스(토스 미니앱) AI 계약서 요약기 프로젝트

---

## 문서 구성

| 문서 | 내용 | 언제 읽나 |
|------|------|----------|
| [01_PRD.md](./01_PRD.md) | 뭘 만드는지, 누가 쓰는지, 성공 기준 | 프로젝트 시작 전 필독 |
| [02_DATA_MODEL.md](./02_DATA_MODEL.md) | AsyncStorage 데이터 구조 (서버 미저장) | DB 설계, 로컬 저장 구현 시 |
| [03_PHASES.md](./03_PHASES.md) | 3단계 개발 계획 + Phase 1 시작 프롬프트 | 개발 순서 정할 때 |
| [04_PROJECT_SPEC.md](./04_PROJECT_SPEC.md) | 기술 스택, DO NOT 목록, 법적 체크리스트 | AI에게 코드 시킬 때마다 |

---

## 프로젝트 한 줄 요약

계약서 사진 한 장 → Claude Vision 분석 → 핵심 요약 + 위험 조항 + 체크리스트 3카드

---

## 핵심 결정 사항

| 항목 | 결정 | 근거 |
|------|------|------|
| Phase 1 계약서 유형 | 임대차 계약서 | 토스 2030 세입자 비율 높음, AI 정확도 높음 |
| 결과 화면 | 3카드 구성 | TDS UI에 적합, 한 화면에 소화 가능 |
| 이력 저장 | AsyncStorage 로컬만 | 서버 미저장 원칙 (PIPA 리스크 최소화) |
| MVP 수익화 | 없음 (무료) | 검수 단순화 + 초기 유저 확보 집중 |
| OCR 방식 | Claude Vision 직접 | 별도 OCR 엔진 불필요, 분석까지 1단계 처리 |

---

## 즉시 착수해야 할 사항

1. **mTLS 인증서 발급 신청** (7~14 영업일 소요 → 지금 당장 신청)
   - 앱인토스 개발자센터 → 워크스페이스 생성 → 인증서 신청
2. **appName 확정** (등록 후 수정 불가)
3. **사업자 업종 확인** (앱 서비스와 일치 여부)
4. **Anthropic API 키 발급** — [console.anthropic.com](https://console.anthropic.com)

---

## 다음 단계

Phase 1을 시작하려면 [03_PHASES.md](./03_PHASES.md)의 **"Phase 1 시작 프롬프트"** 섹션을 복사해서 AI에게 전달하세요.

---

## 미결 사항 종합 ([NEEDS CLARIFICATION])

> 개발 전 반드시 결정 필요

- [x] **appName 확정** — **사인전에** ✅ (2026-03-15)
- [ ] **Claude 모델 선택** — `claude-sonnet-4-6` vs `claude-opus-4-6` (테스트 후 결정)
- [ ] **마스킹 라이브러리** — ML Kit vs 정규식 기반 (번들 크기 vs 정확도 트레이드오프)
- [ ] **무료 횟수 정책** — 일 3회 고정 여부 (Phase 1은 무제한)
- [ ] **DPA/ZDR 계약** — Anthropic 개인정보 처리 위탁 계약 법무 검토
- [ ] **Flask 서버 호스팅** — 자체 서버 vs AWS Lambda
- [ ] **AsyncStorage 이력 보관 정책** — 최근 N개 자동 삭제 기준

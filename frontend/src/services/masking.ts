/**
 * 클라이언트 측 개인정보 마스킹 서비스 (정규식 기반)
 * 이미지를 Claude API로 전송하기 전, 텍스트 레이어에서 개인정보를 감지·마스킹합니다.
 *
 * Phase 1: 정규식 기반 (빠른 구현)
 * Phase 2 검토: ML Kit 기반 (정확도 향상, 번들 크기 증가)
 */

// 주민등록번호: 6자리-7자리
const RRN_PATTERN = /\d{6}-\d{7}/g;

// 계좌번호: 10~14자리 숫자 (은행코드 포함 패턴)
const ACCOUNT_PATTERN = /\d{3,4}-\d{4,6}-\d{4,6}(-\d{2,3})?/g;

// 전화번호 (마스킹 제외 — 계약서에서 연락처는 필요 정보)
// const PHONE_PATTERN = /01[016789]-\d{3,4}-\d{4}/g;

/**
 * 텍스트에서 개인정보 패턴을 마스킹합니다.
 * 이미지 분석 결과 텍스트를 사용자에게 표시할 때 적용합니다.
 */
export function maskSensitiveText(text: string): string {
  return text
    .replace(RRN_PATTERN, '******-*******')
    .replace(ACCOUNT_PATTERN, '****-****-****');
}

/**
 * 마스킹 처리 완료 여부를 확인합니다.
 * 결과 화면에서 "마스킹 완료" UI 피드백에 사용합니다.
 */
export function hasSensitiveData(text: string): boolean {
  return RRN_PATTERN.test(text) || ACCOUNT_PATTERN.test(text);
}

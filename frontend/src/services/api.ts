/**
 * Flask 백엔드 API 호출 서비스
 * 이미지를 base64로 인코딩하여 서버로 전송합니다.
 */

import { AnalysisResult, ContractType } from '../types';

// 환경변수로 관리 (개발: localhost, 배포: 실제 서버)
const API_BASE_URL = __DEV__
  ? 'http://localhost:5001'
  : 'https://web-production-0999d.up.railway.app';

export async function analyzeContract(
  imageBase64: string,
  contractType: ContractType = 'lease'
): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_base64: imageBase64,
      contract_type: contractType,
      consent_verified: true, // storage.ts의 getConsent()로 확인 후 호출
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || '서버 오류가 발생했어요.');
  }

  return response.json();
}

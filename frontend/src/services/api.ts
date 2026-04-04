/**
 * Flask 백엔드 API 호출 서비스
 * 이미지를 base64로 인코딩하여 서버로 전송합니다.
 */

import { AnalysisResult, ContractType } from '../types';

// 환경변수로 관리 (개발: localhost, 배포: 실제 서버)
const API_BASE_URL = __DEV__
  ? 'http://localhost:5001'
  : 'https://web-production-0999d.up.railway.app';

const API_TIMEOUT_MS = 90_000; // 90초

export async function analyzeContract(
  imagesBase64: string[],
  contractType: ContractType = 'lease'
): Promise<AnalysisResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        images_base64: imagesBase64,
        contract_type: contractType,
        consent_verified: true,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || '서버 오류가 발생했어요.');
    }

    const result = await response.json().catch(() => {
      throw new Error('서버 응답을 처리하지 못했어요. 다시 시도해주세요.');
    });
    return result;
  } catch (e: any) {
    if (e.name === 'AbortError') {
      throw new Error('분석 시간이 초과되었어요. 사진을 더 선명하게 찍어 다시 시도해주세요.');
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

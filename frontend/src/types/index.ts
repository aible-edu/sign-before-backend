// 계약서 유형
export type ContractType = 'lease' | 'employment' | 'freelance' | 'general';

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  lease: '임대차 계약서',
  employment: '근로계약서',
  freelance: '프리랜서/용역',
  general: '기타 계약서',
};

// 분석 결과 타입
export interface SummaryItem {
  label: string;
  value: string;
}

export interface AnalysisSummary {
  items: SummaryItem[];
}

export interface RiskItem {
  title: string;
  clause: string;        // 계약서의 해당 문구 또는 조항 위치
  consequence: string;   // 이 문구로 번질 수 있는 상황
  action: string;        // 계약 전 확인·요청할 사항
  negotiation: string;   // 상대방에게 확인 요청할 때 쓸 수 있는 문구 예시
}

export interface AnalysisResult {
  contract_type: ContractType;
  summary: AnalysisSummary;
  risks: RiskItem[];
  checklist: string[];
  message_draft: string; // 확인 항목 기반 메시지 초안 (AI 생성 예시)
  disclaimer: string;
  error: string | null;
}

// AsyncStorage 저장 타입
export interface AnalysisSession {
  id: string;           // UUID
  createdAt: string;    // ISO 날짜
  contractType: ContractType;
  thumbnailUri?: string;
  result: AnalysisResult;
}

export interface ConsentRecord {
  agreedAt: string;     // ISO 날짜
  version: string;      // 동의서 버전 (업데이트 시 재동의)
}

export interface DailyUsage {
  date: string;         // YYYY-MM-DD
  count: number;
  freeQuota: number;    // Phase 1: 999 (무제한)
}

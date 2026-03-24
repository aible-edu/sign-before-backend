/**
 * 분석 결과 화면
 * AI 활용 고지 (앱인토스 의무) + 확인 항목 건수 + 3카드 결과 + 메시지 초안 + 면책 문구
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Txt, Button } from '@toss/tds-react-native';
import { AnalysisResult, CONTRACT_TYPE_LABELS } from '../types';
import ResultCard from '../components/ResultCard';

interface Props {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export default function ResultScreen({ result, onNewAnalysis }: Props) {
  const [draftOpen, setDraftOpen] = useState(false);
  const riskCount = result.risks.length;
  const contractLabel = CONTRACT_TYPE_LABELS[result.contract_type] ?? '계약서';

  return (
    <SafeAreaView style={styles.container}>
      {/* AI 활용 고지 (앱인토스 정책 의무 — 위반 시 최대 3,000만원 과태료) */}
      <View style={styles.aiBanner}>
        <Txt typography="st12" color="#3182F6" textAlign="center">
          🤖 AI가 생성한 분석 결과예요
        </Txt>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Txt typography="t3" fontWeight="bold" color="#191F28" style={styles.title}>
          {contractLabel} 분석 완료
        </Txt>

        {/* 확인 항목 건수 배지 */}
        <View style={styles.countRow}>
          {riskCount > 0 ? (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>확인 항목이 {riskCount}개 있어요</Text>
            </View>
          ) : (
            <View style={[styles.countBadge, styles.countBadgeOk]}>
              <Text style={[styles.countText, styles.countTextOk]}>확인 항목이 없어요</Text>
            </View>
          )}
          <Txt typography="st12" color="#6B7684" style={styles.countNote}>
            아래 내용은 일반적인 참고 정보예요.
          </Txt>
        </View>

        <ResultCard result={result} />

        {/* 메시지 초안 섹션 */}
        {result.message_draft ? (
          <View style={styles.draftSection}>
            <TouchableOpacity
              style={styles.draftToggle}
              onPress={() => setDraftOpen(!draftOpen)}
              activeOpacity={0.7}
            >
              <Text style={styles.draftToggleLabel}>✉️  확인 요청 메시지 초안 보기</Text>
              <Text style={styles.draftToggleIcon}>{draftOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {draftOpen && (
              <View style={styles.draftBody}>
                <View style={styles.draftNotice}>
                  <Text style={styles.draftNoticeText}>
                    아래는 AI가 생성한 메시지 예시예요. 내용을 확인하고 직접 수정해서 사용해요.
                  </Text>
                </View>
                <Text style={styles.draftText}>{result.message_draft}</Text>
              </View>
            )}
          </View>
        ) : null}

        <View style={styles.newBtnArea}>
          <Button display="block" type="light" onPress={onNewAnalysis}>
            + 새 계약서 분석하기
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F6' },
  aiBanner: {
    backgroundColor: '#EBF3FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1E4FF',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { marginTop: 24, marginBottom: 10 },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  countBadge: {
    backgroundColor: '#FFF0E0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countBadgeOk: { backgroundColor: '#E6F4EA' },
  countText: { fontSize: 12, color: '#F5900A', fontWeight: '600' },
  countTextOk: { color: '#2E7D32' },
  countNote: { flex: 1 },
  // 메시지 초안
  draftSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  draftToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  draftToggleLabel: { fontSize: 14, color: '#3182F6', fontWeight: '600' },
  draftToggleIcon: { fontSize: 12, color: '#6B7684' },
  draftBody: {
    borderTopWidth: 1,
    borderTopColor: '#F2F4F6',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  draftNotice: {
    backgroundColor: '#FFF8EC',
    borderRadius: 6,
    padding: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  draftNoticeText: { fontSize: 11, color: '#6B7684', lineHeight: 16 },
  draftText: { fontSize: 13, color: '#333D4B', lineHeight: 22 },
  newBtnArea: { marginTop: 4 },
});

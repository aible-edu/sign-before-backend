/**
 * 국외이전 동의 화면 (최초 1회)
 * PIPA 제28조의9 필수 항목: 이전 항목·국가·수령자·보존기간·거부 절차
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Txt, Agreement, Button } from '@toss/tds-react-native';
import { saveConsent } from '../services/storage';

interface Props {
  onAgreed: () => void;
}

export default function ConsentScreen({ onAgreed }: Props) {
  const [checked, setChecked] = useState(false);

  async function handleAgree() {
    if (!checked) return;
    await saveConsent();
    onAgreed();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Txt typography="t4" fontWeight="bold" color="#191F28">
          개인정보 국외이전 동의
        </Txt>
        <Txt typography="st11" color="#6B7684" style={styles.subtitle}>
          서비스를 이용하려면 아래 내용을 확인해요.
        </Txt>

        <View style={styles.card}>
          <ConsentRow label="이전 항목" value="계약서 이미지 (분석 후 즉시 삭제)" />
          <ConsentRow label="이전 국가" value="미국" />
          <ConsentRow label="수령자" value="Anthropic, PBC" />
          <ConsentRow label="이전 목적" value="AI 계약서 내용 분석" />
          <ConsentRow label="보존 기간" value="서버에 저장하지 않음 (AI 제공사 정책에 따라 최대 30일 보존 후 삭제, 정책 변경 시 달라질 수 있어요)" />
          <ConsentRow
            label="거부 방법"
            value="동의하지 않으면 계약서 분석 서비스를 이용할 수 없어요."
            last
          />
        </View>

        <View style={styles.notice}>
          <Txt typography="st12" color="#6B7684" style={styles.noticeText}>
            {'⚠️ AI가 생성한 일반적인 정보예요. 법률 조언이 아니니\n중요한 사항은 전문가와 상담해요.'}
          </Txt>
        </View>

        <Agreement.CheckboxField
          type="medium-regular"
          checked={checked}
          onCheckedChange={setChecked}
        >
          위 내용을 확인했으며 동의해요.
        </Agreement.CheckboxField>
      </ScrollView>

      <View style={styles.buttonArea}>
        <Button display="block" disabled={!checked} onPress={handleAgree}>
          동의하고 시작하기
        </Button>
      </View>
    </SafeAreaView>
  );
}

function ConsentRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Txt typography="st12" color="#6B7684" style={styles.rowLabel}>
        {label}
      </Txt>
      <Txt typography="st11" color="#191F28">
        {value}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F6' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 },
  subtitle: { marginTop: 8, marginBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F6',
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { marginBottom: 4 },
  notice: {
    backgroundColor: '#FFF8EC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  noticeText: { lineHeight: 18 },
  buttonArea: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
});

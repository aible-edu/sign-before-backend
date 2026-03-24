/**
 * 3카드 결과 컴포넌트
 * 카드 ①: 핵심 요약 / 카드 ②: 주의 항목 (4단계) / 카드 ③: 체크리스트
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

export default function ResultCard({ result }: Props) {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const riskCount = result.risks.length;

  const tabs = [
    { label: '핵심 요약', icon: '📋' },
    { label: '주의 항목', icon: '📌', badge: riskCount > 0 ? String(riskCount) : undefined },
    { label: '체크리스트', icon: '✅' },
  ];

  return (
    <View style={styles.container}>
      {/* 탭 */}
      <View style={styles.tabs}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i as 0 | 1 | 2)}
            activeOpacity={0.7}
          >
            <View style={styles.tabIconRow}>
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              {tab.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, activeTab === i && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 카드 ① 핵심 요약 */}
      {activeTab === 0 && (
        <View style={styles.card}>
          {result.summary.items.map((item, i) => (
            <View
              key={i}
              style={[styles.summaryRow, i === result.summary.items.length - 1 && styles.summaryRowLast]}
            >
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 카드 ② 주의 항목 */}
      {activeTab === 1 && (
        <View style={styles.card}>
          {riskCount === 0 ? (
            <Text style={styles.emptyText}>확인할 항목이 없어요.</Text>
          ) : (
            result.risks.map((risk, i) => (
              <View key={i} style={[styles.riskItem, i === riskCount - 1 && styles.riskItemLast]}>
                <Text style={styles.riskTitle}>📌 {risk.title}</Text>

                {risk.clause ? (
                  <View style={styles.clauseBox}>
                    <Text style={styles.clauseText}>"{risk.clause}"</Text>
                  </View>
                ) : null}

                <View style={styles.riskRow}>
                  <Text style={styles.riskRowLabel}>상황</Text>
                  <Text style={styles.riskRowValue}>{risk.consequence}</Text>
                </View>
                <View style={styles.riskRow}>
                  <Text style={styles.riskRowLabel}>확인</Text>
                  <Text style={styles.riskRowValue}>{risk.action}</Text>
                </View>

                {risk.negotiation ? (
                  <View style={styles.negotiationBox}>
                    <Text style={styles.negotiationLabel}>💬 문구 예시</Text>
                    <Text style={styles.negotiationText}>{risk.negotiation}</Text>
                  </View>
                ) : null}
              </View>
            ))
          )}
        </View>
      )}

      {/* 카드 ③ 체크리스트 */}
      {activeTab === 2 && (
        <View style={styles.card}>
          {result.checklist.map((item, i) => (
            <CheckItem key={i} text={item} />
          ))}
        </View>
      )}

      {/* 면책 문구 (항상 표시) */}
      <Text style={styles.disclaimer}>{result.disclaimer}</Text>
    </View>
  );
}

function CheckItem({ text }: { text: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <TouchableOpacity
      style={styles.checkItem}
      onPress={() => setChecked(!checked)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkBox, checked && styles.checkBoxDone]}>
        {checked && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={[styles.checkText, checked && styles.checkTextDone]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E8EB',
  },
  tabActive: { backgroundColor: '#EBF3FF', borderColor: '#3182F6' },
  tabIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  tabIcon: { fontSize: 18 },
  badge: {
    backgroundColor: '#F5900A',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 4,
  },
  badgeText: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' },
  tabLabel: { fontSize: 11, color: '#6B7684' },
  tabLabelActive: { color: '#3182F6', fontWeight: '600' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  summaryRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F6',
  },
  summaryRowLast: { borderBottomWidth: 0 },
  summaryLabel: { fontSize: 12, color: '#6B7684', marginBottom: 3 },
  summaryValue: { fontSize: 15, color: '#191F28' },
  riskItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F6',
  },
  riskItemLast: { borderBottomWidth: 0 },
  riskTitle: { fontSize: 14, fontWeight: '600', color: '#F5900A', marginBottom: 8 },
  clauseBox: {
    backgroundColor: '#FFF8EC',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  clauseText: { fontSize: 12, color: '#6B7684', fontStyle: 'italic', lineHeight: 18 },
  riskRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  riskRowLabel: { fontSize: 11, color: '#B0B8C1', width: 30, marginTop: 2 },
  riskRowValue: { flex: 1, fontSize: 13, color: '#333D4B', lineHeight: 20 },
  negotiationBox: {
    backgroundColor: '#F0F7FF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  negotiationLabel: { fontSize: 11, color: '#3182F6', fontWeight: '600', marginBottom: 4 },
  negotiationText: { fontSize: 12, color: '#333D4B', lineHeight: 18 },
  emptyText: { fontSize: 14, color: '#6B7684', textAlign: 'center', paddingVertical: 20 },
  checkItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10 },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#C7CBD1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  checkBoxDone: { backgroundColor: '#3182F6', borderColor: '#3182F6' },
  checkMark: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  checkText: { flex: 1, fontSize: 14, color: '#333D4B', lineHeight: 22 },
  checkTextDone: { color: '#B0B8C1', textDecorationLine: 'line-through' },
  disclaimer: {
    fontSize: 11,
    color: '#B0B8C1',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
  },
});

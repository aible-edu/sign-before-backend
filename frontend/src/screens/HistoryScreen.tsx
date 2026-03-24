/**
 * 분석 이력 화면
 * AsyncStorage에서 로컬 저장된 이력을 표시합니다.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { getSessions, deleteSession } from '../services/storage';
import { AnalysisSession, CONTRACT_TYPE_LABELS } from '../types';

interface Props {
  onSelectSession: (session: AnalysisSession) => void;
}

export default function HistoryScreen({ onSelectSession }: Props) {
  const [sessions, setSessions] = useState<AnalysisSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const data = await getSessions();
    setSessions(data);
  }

  async function handleDelete(id: string) {
    Alert.alert('삭제', '이 분석 이력을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await deleteSession(id);
          await loadSessions();
        },
      },
    ]);
  }

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  if (sessions.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📂</Text>
        <Text style={styles.emptyText}>분석 이력이 없습니다</Text>
        <Text style={styles.emptySubtext}>계약서를 분석하면 여기에 저장됩니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>분석 이력</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => onSelectSession(item)}
            onLongPress={() => handleDelete(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemType}>{CONTRACT_TYPE_LABELS[item.contractType] ?? '계약서'}</Text>
              <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
              <Text style={styles.itemPreview} numberOfLines={1}>
                {item.result.summary.items?.[0]?.value ?? ''}
              </Text>
            </View>
            <Text style={styles.itemArrow}>›</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Text style={styles.hint}>길게 누르면 삭제할 수 있습니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F6', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#191F28', marginBottom: 16 },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: { flex: 1 },
  itemType: { fontSize: 13, color: '#3182F6', fontWeight: '600', marginBottom: 2 },
  itemDate: { fontSize: 12, color: '#6B7684', marginBottom: 4 },
  itemPreview: { fontSize: 14, color: '#333D4B' },
  itemArrow: { fontSize: 22, color: '#C7CBD1', marginLeft: 8 },
  separator: { height: 8 },
  hint: { fontSize: 12, color: '#B0B8C1', textAlign: 'center', marginTop: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#191F28', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#6B7684' },
});

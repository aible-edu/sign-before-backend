/**
 * 촬영/갤러리 선택 화면
 * 계약서 종류 선택 → 이미지 선택 → base64 변환 → 분석 화면으로 이동
 */

import React from 'react';
import { View, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text } from 'react-native';
import { Txt, Button } from '@toss/tds-react-native';
import {
  openCamera,
  fetchAlbumPhotos,
  OpenCameraPermissionError,
  FetchAlbumPhotosPermissionError,
} from '@apps-in-toss/framework';
import { ContractType, CONTRACT_TYPE_LABELS } from '../types';

const CONTRACT_TYPES: { type: ContractType; icon: string }[] = [
  { type: 'lease', icon: '🏠' },
  { type: 'employment', icon: '💼' },
  { type: 'freelance', icon: '💻' },
  { type: 'general', icon: '📄' },
];

interface Props {
  contractType: ContractType;
  onContractTypeChange: (type: ContractType) => void;
  onImageSelected: (imageBase64: string, type: ContractType) => void;
}

export default function CameraScreen({ contractType, onContractTypeChange, onImageSelected }: Props) {
  function extractBase64(dataUri: string): string {
    const comma = dataUri.indexOf(',');
    return comma >= 0 ? dataUri.slice(comma + 1) : dataUri;
  }

  function confirmAndProceed(base64: string) {
    const label = CONTRACT_TYPE_LABELS[contractType];
    Alert.alert(
      '계약서 확인',
      `선택한 유형: ${label}\n이 유형으로 분석을 시작할까요?`,
      [
        { text: '아니요, 다시 선택', style: 'cancel' },
        { text: '맞아요', onPress: () => onImageSelected(base64, contractType) },
      ],
    );
  }

  async function handleCamera() {
    try {
      const response = await openCamera({ base64: true });
      confirmAndProceed(extractBase64(response.dataUri));
    } catch (e) {
      if (e instanceof OpenCameraPermissionError) {
        Alert.alert('카메라 권한이 필요해요', '카메라 권한을 허용하면 촬영할 수 있어요.');
      }
    }
  }

  async function handleGallery() {
    try {
      const photos = await fetchAlbumPhotos({ maxCount: 1, base64: true });
      if (photos.length > 0) {
        confirmAndProceed(extractBase64(photos[0].dataUri));
      }
    } catch (e) {
      if (e instanceof FetchAlbumPhotosPermissionError) {
        Alert.alert('사진 접근이 필요해요', '사진 접근 권한을 허용하면 갤러리를 사용할 수 있어요.');
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단: 계약서 종류 선택 */}
      <View style={styles.topSection}>
        <Txt typography="st11" color="#6B7684" style={styles.sectionLabel}>
          계약서 종류
        </Txt>
        <View style={styles.typeGrid}>
          {[CONTRACT_TYPES.slice(0, 2), CONTRACT_TYPES.slice(2, 4)].map((row, rowIdx) => (
            <View key={rowIdx} style={styles.typeRow}>
              {row.map(({ type, icon }) => {
                const active = contractType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeChip, active && styles.typeChipActive]}
                    onPress={() => onContractTypeChange(type)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.typeIcon}>{icon}</Text>
                    <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>
                      {CONTRACT_TYPE_LABELS[type]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* 하단: 촬영 안내 + 버튼 */}
      <View style={styles.bottomSection}>
        <Txt typography="t3" fontWeight="bold" color="#191F28" style={styles.title}>
          계약서를 촬영해요
        </Txt>
        <Txt typography="st11" color="#6B7684" style={styles.subtitle}>
          {'계약서 전체가 잘 보이도록 밝은 곳에서 촬영해요.\n주민번호·계좌번호는 자동으로 가려져요.'}
        </Txt>

        <View style={styles.buttonGroup}>
          <Button display="block" onPress={handleCamera}>
            📷  카메라로 촬영
          </Button>
          <Button display="block" type="light" onPress={handleGallery}>
            갤러리에서 선택
          </Button>
        </View>

        <Txt typography="t7" color="#6B7684" textAlign="center" style={styles.tip}>
          💡 계약서가 선명할수록 분석이 더 정확해져요.
        </Txt>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F6' },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 8,
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  sectionLabel: { marginBottom: 12 },
  typeGrid: {
    gap: 10,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeChip: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E8EB',
  },
  typeChipActive: {
    backgroundColor: '#EBF3FF',
    borderColor: '#3182F6',
  },
  typeIcon: { fontSize: 24 },
  typeLabel: { fontSize: 13, color: '#6B7684' },
  typeLabelActive: { color: '#3182F6', fontWeight: '600' },
  title: { marginBottom: 12 },
  subtitle: { marginBottom: 32, lineHeight: 22 },
  buttonGroup: { gap: 12 },
  tip: { marginTop: 24 },
});

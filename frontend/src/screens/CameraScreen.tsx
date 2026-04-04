/**
 * 촬영/갤러리 선택 화면
 * 계약서 종류 선택 → 이미지 선택(여러 장 가능) → 분석 화면으로 이동
 *
 * - 카메라: 1장씩 촬영 후 "추가 촬영" / "분석 시작" 선택
 * - 갤러리: 최대 10장 한번에 선택
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from 'react-native';
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

const MAX_IMAGES = 10;

interface Props {
  contractType: ContractType;
  onContractTypeChange: (type: ContractType) => void;
  onImagesSelected: (imagesBase64: string[], type: ContractType) => void;
}

export default function CameraScreen({ contractType, onContractTypeChange, onImagesSelected }: Props) {
  const [images, setImages] = useState<string[]>([]);

  function extractBase64(dataUri: string): string {
    const comma = dataUri.indexOf(',');
    return comma >= 0 ? dataUri.slice(comma + 1) : dataUri;
  }

  function handleAnalyze(imgs: string[]) {
    const label = CONTRACT_TYPE_LABELS[contractType];
    Alert.alert(
      '계약서 확인',
      `선택한 유형: ${label}\n총 ${imgs.length}장 분석을 시작할까요?`,
      [
        { text: '아니요, 다시 선택', style: 'cancel' },
        { text: '맞아요', onPress: () => onImagesSelected(imgs, contractType) },
      ],
    );
  }

  async function shootAndAdd(currentImages: string[]) {
    if (currentImages.length >= MAX_IMAGES) {
      Alert.alert('최대 장수 초과', `이미지는 최대 ${MAX_IMAGES}장까지 추가할 수 있어요.`);
      return;
    }
    try {
      const response = await openCamera({ base64: true });
      const b64 = extractBase64(response.dataUri);
      const next = [...currentImages, b64];
      setImages(next);

      Alert.alert(
        `${next.length}장 추가됨`,
        next.length < MAX_IMAGES ? '추가로 촬영하거나 분석을 시작하세요.' : `최대 ${MAX_IMAGES}장에 도달했어요.`,
        [
          ...(next.length < MAX_IMAGES
            ? [{ text: '추가 촬영', onPress: () => shootAndAdd(next) }]
            : []),
          { text: '분석 시작', onPress: () => handleAnalyze(next) },
        ],
      );
    } catch (e) {
      if (e instanceof OpenCameraPermissionError) {
        Alert.alert('카메라 권한�� 필요해요', '카메라 권한을 허용하면 촬영할 �� 있어요.');
      } else {
        console.error('Camera error:', e);
        Alert.alert('오류 발생', '카메라를 열지 못했어요. 다시 ��도해주세요.');
      }
    }
  }

  function handleCamera() {
    shootAndAdd(images);
  }

  async function handleGallery() {
    try {
      const remaining = MAX_IMAGES - images.length;
      const photos = await fetchAlbumPhotos({ maxCount: remaining, base64: true });
      if (photos.length === 0) return;

      const added = photos.map(p => extractBase64(p.dataUri));
      const next = [...images, ...added];
      setImages(next);
      handleAnalyze(next);
    } catch (e) {
      if (e instanceof FetchAlbumPhotosPermissionError) {
        Alert.alert('사진 접근이 필요해요', '사진 접근 권한을 허용하면 갤러리를 사용할 수 있어요.');
      } else {
        console.error('Gallery error:', e);
        Alert.alert('오류 발생', '갤러리를 열지 못했어요. 다시 시도해주세요.');
      }
    }
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index));
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

      {/* 중간: 추가된 이미지 썸네일 목록 */}
      {images.length > 0 && (
        <View style={styles.thumbnailSection}>
          <Txt typography="st11" color="#6B7684" style={styles.sectionLabel}>
            추가된 페이지 ({images.length}/{MAX_IMAGES})
          </Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailScroll}>
            {images.map((b64, i) => (
              <View key={i} style={styles.thumbnailWrapper}>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${b64}` }}
                  style={styles.thumbnail}
                />
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(i)}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.thumbnailLabel}>{i + 1}p</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 하단: 촬영 안내 + 버튼 */}
      <View style={styles.bottomSection}>
        <Txt typography="t3" fontWeight="bold" color="#191F28" style={styles.title}>
          {images.length === 0 ? '계약서를 촬영해요' : '페이지를 추가하거나 분석을 시작해요'}
        </Txt>
        <Txt typography="st11" color="#6B7684" style={styles.subtitle}>
          {images.length === 0
            ? '계약서 전체가 잘 보이도록 밝은 곳에서 촬영해요.\n주민번호·계좌번호는 자동으로 가려져요.'
            : `여러 장이면 페이지 순서대로 추가해요. (최대 ${MAX_IMAGES}장)`}
        </Txt>

        <View style={styles.buttonGroup}>
          <Button display="block" onPress={handleCamera}>
            {images.length === 0 ? '📷  카메라로 촬영' : '📷  페이지 추가 촬영'}
          </Button>
          <Button display="block" type="light" onPress={handleGallery}>
            갤러리에서 선택
          </Button>
          {images.length > 0 && (
            <Button display="block" type="primary" onPress={() => handleAnalyze(images)}>
              분석 시작 ({images.length}장)
            </Button>
          )}
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
  thumbnailSection: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  thumbnailScroll: {
    marginTop: 8,
  },
  thumbnailWrapper: {
    marginRight: 10,
    position: 'relative',
    alignItems: 'center',
  },
  thumbnail: {
    width: 72,
    height: 96,
    borderRadius: 8,
    backgroundColor: '#E5E8EB',
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF4D4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  thumbnailLabel: {
    marginTop: 4,
    fontSize: 11,
    color: '#6B7684',
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  sectionLabel: { marginBottom: 12 },
  typeGrid: { gap: 10 },
  typeRow: { flexDirection: 'row', gap: 10 },
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

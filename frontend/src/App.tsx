/**
 * 사인전에 — 앱인토스 미니앱 진입점
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import ConsentScreen from './screens/ConsentScreen';
import CameraScreen from './screens/CameraScreen';
import LoadingScreen from './screens/LoadingScreen';
import ResultScreen from './screens/ResultScreen';
import { analyzeContract } from './services/api';
import { getConsent } from './services/storage';
import { AnalysisResult, ContractType } from './types';

type Screen = 'splash' | 'consent' | 'camera' | 'loading' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [contractType, setContractType] = useState<ContractType>('lease');

  async function handleSplashFinish() {
    try {
      const agreed = await getConsent();
      setScreen(agreed ? 'camera' : 'consent');
    } catch {
      setScreen('consent');
    }
  }

  async function handleImageSelected(imageBase64: string, type: ContractType) {
    setScreen('loading');
    try {
      const data = await analyzeContract(imageBase64, type);
      setResult(data);
      setScreen('result');
    } catch (e: any) {
      setScreen('camera');
      Alert.alert('분석을 완료하지 못했어요', e?.message || '사진을 더 밝고 선명하게 찍어 다시 시도해요.');
    }
  }

  return (
    <View style={styles.container}>
      {screen === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}
      {screen === 'consent' && (
        <ConsentScreen onAgreed={() => setScreen('camera')} />
      )}
      {screen === 'camera' && (
        <CameraScreen
          contractType={contractType}
          onContractTypeChange={setContractType}
          onImageSelected={handleImageSelected}
        />
      )}
      {screen === 'loading' && <LoadingScreen />}
      {screen === 'result' && result && (
        <ResultScreen
          result={result}
          onNewAnalysis={() => { setResult(null); setScreen('camera'); }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

/**
 * 분석 중 로딩 화면
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt, Loader } from '@toss/tds-react-native';

const STEPS = [
  '계약서 이미지를 처리하고 있어요',
  '핵심 조항을 분석하고 있어요',
  '확인 항목을 살펴보고 있어요',
  '체크리스트를 만들고 있어요',
];

export default function LoadingScreen() {
  const stepIndex = useRef(0);
  const [stepText, setStepText] = React.useState(STEPS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      stepIndex.current = (stepIndex.current + 1) % STEPS.length;
      setStepText(STEPS[stepIndex.current]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Loader size="large" />
      <Txt typography="t4" fontWeight="bold" color="#191F28" style={styles.title}>
        AI가 분석하고 있어요
      </Txt>
      <Txt typography="t6" color="#6B7684">
        {stepText}
      </Txt>
      <Txt typography="st13" color="#B0B8C1" style={styles.notice}>
        AI 활용 서비스 · 법률 조언이 아니에요
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { marginTop: 24, marginBottom: 12 },
  notice: { position: 'absolute', bottom: 40 },
});

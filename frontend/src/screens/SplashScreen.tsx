/**
 * 스플래시 화면
 * 앱 진입 시 1.8초 동안 표시 후 자동으로 다음 화면으로 전환
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.sequence([
      // 페이드인 + 확대
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // 유지
      Animated.delay(900),
      // 페이드아웃
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.icon}>📝</Text>
        <Text style={styles.appName}>사인전에</Text>
        <Text style={styles.tagline}>계약서, 사인하기 전에 확인해요</Text>
      </Animated.View>
      <Text style={styles.footer}>AI 활용 서비스 · 법률 조언이 아니에요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3182F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: -0.2,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
});

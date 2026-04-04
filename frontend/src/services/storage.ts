/**
 * 앱인토스 네이티브 Storage 서비스
 * 분석 이력, 동의 기록, 일별 사용량을 기기 로컬에 저장합니다.
 * 서버에는 어떤 데이터도 저장하지 않습니다.
 */

import { Storage } from '@apps-in-toss/native-modules';
import { AnalysisSession, ConsentRecord, DailyUsage } from '../types';

const KEYS = {
  SESSIONS: 'sainjeone:sessions',
  CONSENT: 'sainjeone:consent',
  DAILY_USAGE: 'sainjeone:daily_usage',
};

const CONSENT_VERSION = '1.1';
const MAX_SESSIONS = 50;

// ── 동의 기록 ──────────────────────────────────────────────

export async function saveConsent(): Promise<void> {
  const record: ConsentRecord = {
    agreedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  await Storage.setItem(KEYS.CONSENT, JSON.stringify(record));
}

export async function getConsent(): Promise<ConsentRecord | null> {
  const raw = await Storage.getItem(KEYS.CONSENT);
  if (!raw) return null;
  try {
    const record: ConsentRecord = JSON.parse(raw);
    if (record.version !== CONSENT_VERSION) return null;
    return record;
  } catch {
    await Storage.removeItem(KEYS.CONSENT);
    return null;
  }
}

// ── 분석 이력 ──────────────────────────────────────────────

export async function getSessions(): Promise<AnalysisSession[]> {
  const raw = await Storage.getItem(KEYS.SESSIONS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    await Storage.removeItem(KEYS.SESSIONS);
    return [];
  }
}

export async function saveSession(session: AnalysisSession): Promise<void> {
  const sessions = await getSessions();
  const updated = [session, ...sessions].slice(0, MAX_SESSIONS);
  await Storage.setItem(KEYS.SESSIONS, JSON.stringify(updated));
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await getSessions();
  const updated = sessions.filter(s => s.id !== id);
  await Storage.setItem(KEYS.SESSIONS, JSON.stringify(updated));
}

// ── 일별 사용량 ────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getDailyUsage(): Promise<DailyUsage> {
  const raw = await Storage.getItem(KEYS.DAILY_USAGE);
  const today = todayStr();

  if (raw) {
    try {
      const usage: DailyUsage = JSON.parse(raw);
      if (usage.date === today) return usage;
    } catch {
      await Storage.removeItem(KEYS.DAILY_USAGE);
    }
  }

  return { date: today, count: 0, freeQuota: 999 }; // Phase 1: 무제한
}

export async function incrementDailyUsage(): Promise<DailyUsage> {
  const usage = await getDailyUsage();
  const updated: DailyUsage = { ...usage, count: usage.count + 1 };
  await Storage.setItem(KEYS.DAILY_USAGE, JSON.stringify(updated));
  return updated;
}

export async function canAnalyzeToday(): Promise<boolean> {
  const usage = await getDailyUsage();
  return usage.count < usage.freeQuota;
}

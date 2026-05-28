import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_FROM, DEFAULT_TO } from '../../config';

const STORAGE_KEY = 'currencies/v1';

interface CurrencyPair {
  from: string;
  to: string;
}

export interface UseStoredCurrenciesResult {
  from: string;
  to: string;
  setFrom: (code: string) => void;
  setTo: (code: string) => void;
  hydrated: boolean;
}

function parseStored(raw: string | null): CurrencyPair | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const record = parsed as Record<string, unknown>;
    if (typeof record.from !== 'string' || typeof record.to !== 'string') return null;
    return { from: record.from, to: record.to };
  } catch {
    return null;
  }
}

export function useStoredCurrencies(): UseStoredCurrenciesResult {
  const [pair, setPair] = useState<CurrencyPair>({
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      const stored = parseStored(raw);
      if (stored) setPair(stored);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pair));
  }, [pair, hydrated]);

  return {
    from: pair.from,
    to: pair.to,
    setFrom: (code) => setPair((prev) => ({ ...prev, from: code })),
    setTo: (code) => setPair((prev) => ({ ...prev, to: code })),
    hydrated,
  };
}

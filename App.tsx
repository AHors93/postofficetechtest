import { useCallback, useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fetchRates } from './src/api/client';
import type { RatesResponse } from './src/api/types';
import { useSplashTransition } from './src/hooks/useSplashTransition';
import { useStoredCurrencies } from './src/hooks/useStoredCurrencies';
import { MainScreen } from './src/screens/MainScreen';
import { SplashScreen } from './src/screens/SplashScreen';

const MIN_SPLASH_MS = 2500;
const FADE_OUT_MS = 600;

export default function App() {
  const stored = useStoredCurrencies();
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (!stored.hydrated) return;
    let cancelled = false;
    setError(null);
    fetchRates(stored.from)
      .then((nextRates) => {
        if (!cancelled) setRates(nextRates);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load rates');
      });
    return () => {
      cancelled = true;
    };
  }, [stored.hydrated, stored.from, retryToken]);

  const onRetry = useCallback(() => setRetryToken((n) => n + 1), []);

  const splash = useSplashTransition({
    ready: stored.hydrated && rates !== null,
    minDelayMs: MIN_SPLASH_MS,
    fadeOutMs: FADE_OUT_MS,
  });

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style={splash.mounted ? 'light' : 'dark'} />
        {rates !== null && stored.hydrated && (
          <MainScreen
            from={stored.from}
            to={stored.to}
            setFrom={stored.setFrom}
            setTo={stored.setTo}
            rates={rates}
          />
        )}
        {splash.mounted && (
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: splash.opacity }]}
            pointerEvents={rates !== null ? 'none' : 'auto'}
          >
            <SplashScreen error={error} onRetry={onRetry} />
          </Animated.View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

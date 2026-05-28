import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

interface Options {
  ready: boolean;
  minDelayMs: number;
  fadeOutMs: number;
}

export interface SplashTransition {
  opacity: Animated.Value;
  mounted: boolean;
}

export function useSplashTransition({
  ready,
  minDelayMs,
  fadeOutMs,
}: Options): SplashTransition {
  const opacity = useRef(new Animated.Value(1)).current;
  const [mounted, setMounted] = useState(true);
  const [minDelayElapsed, setMinDelayElapsed] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setMinDelayElapsed(true), minDelayMs);
    return () => clearTimeout(timeoutId);
  }, [minDelayMs]);

  useEffect(() => {
    if (!ready || !minDelayElapsed || !mounted) return;
    Animated.timing(opacity, {
      toValue: 0,
      duration: fadeOutMs,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [ready, minDelayElapsed, mounted, opacity, fadeOutMs]);

  return { opacity, mounted };
}

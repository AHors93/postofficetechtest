import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  error: string | null;
  onRetry?: () => void;
}

const SYMBOLS = ['£', '$', '€', '¥', 'Fr', 'R', '฿', '$'];
const RADIUS = 95;

export function SplashScreen({ error, onRetry }: Props) {
  const spin = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();

    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    return () => loop.stop();
  }, []);

  const ringSpin = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const counterSpin = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <LinearGradient
      colors={['#E4002B', '#A30022']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View style={[styles.ring, { opacity: fadeIn, transform: [{ rotate: ringSpin }] }]}>
        {SYMBOLS.map((symbol, index) => {
          const angle = (index / SYMBOLS.length) * 360;
          return (
            <Animated.View
              key={index}
              style={[
                styles.symbolWrapper,
                {
                  transform: [
                    { rotate: `${angle}deg` },
                    { translateY: -RADIUS },
                    { rotate: `${-angle}deg` },
                    { rotate: counterSpin },
                  ],
                },
              ]}
            >
              <View style={styles.symbol}>
                <Text style={styles.symbolText}>{symbol}</Text>
              </View>
            </Animated.View>
          );
        })}
      </Animated.View>

      <Animated.View style={{ opacity: fadeIn }}>
        <Text style={styles.title}>Currency Converter</Text>
        {error ? (
          <View style={styles.errorBlock}>
            <Text style={styles.error}>{error}</Text>
            {onRetry && (
              <Pressable
                onPress={onRetry}
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed && styles.retryButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Retry loading rates"
                testID="retry-button"
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.dots}>
            <LoadingDot delay={0} />
            <LoadingDot delay={200} />
            <LoadingDot delay={400} />
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const dotY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotY, {
          toValue: -8,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dotY, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    const timeoutId = setTimeout(() => loop.start(), 500 + delay);
    return () => {
      clearTimeout(timeoutId);
      loop.stop();
    };
  }, [delay]);

  return (
    <Animated.View style={[styles.dot, { transform: [{ translateY: dotY }] }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 56,
  },
  ring: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  symbolText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E4002B',
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  error: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
    opacity: 0.9,
  },
  errorBlock: {
    alignItems: 'center',
    gap: 16,
  },
  retryButton: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#ffffff',
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryText: {
    color: '#E4002B',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

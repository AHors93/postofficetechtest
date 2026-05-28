import { useMemo } from 'react';
import {
  Alert,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { RatesResponse } from '../api/types';
import { CurrencyDropdown } from '../components/CurrencyDropdown';
import SwapIcon from '../../assets/flags/SwapFrom.svg';
import { CURRENCY_SYMBOLS } from '../config';
import { useConverter } from '../hooks/useConverter';
import { formatAmount } from '../utils/format';

interface Props {
  from: string;
  to: string;
  setFrom: (code: string) => void;
  setTo: (code: string) => void;
  rates: RatesResponse;
}

const SAME_CURRENCY_ALERT_TITLE = 'Same currency selected';
const SAME_CURRENCY_ALERT_MESSAGE =
  'You cannot select the same currency for both dropdowns.';
const KEYBOARD_ACCESSORY_ID = 'currency-input-done';

export function MainScreen({ from, to, setFrom, setTo, rates }: Props) {
  const insets = useSafeAreaInsets();
  const { rate, fromValue, toValue, onFromAmountChange, onToAmountChange } =
    useConverter({ from, to, rates });

  const currencies = useMemo(() => {
    const codes = new Set<string>([from, ...Object.keys(rates)]);
    return Array.from(codes).sort();
  }, [from, rates]);

  const fromSymbol = CURRENCY_SYMBOLS[from] ?? '';
  const toSymbol = CURRENCY_SYMBOLS[to] ?? '';

  const onSelectFrom = (code: string) => {
    if (code === to) {
      Alert.alert(SAME_CURRENCY_ALERT_TITLE, SAME_CURRENCY_ALERT_MESSAGE);
      return;
    }
    setFrom(code);
  };

  const onSelectTo = (code: string) => {
    if (code === from) {
      Alert.alert(SAME_CURRENCY_ALERT_TITLE, SAME_CURRENCY_ALERT_MESSAGE);
      return;
    }
    setTo(code);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#E4002B', '#A30022']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerTitle}>Currency Converter</Text>
      </LinearGradient>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={[
            styles.body,
            { paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <SwapIcon width={64} height={64} />
          </View>

          <Text style={styles.sectionLabel}>Swap from</Text>

          <CurrencyDropdown
            value={from}
            options={currencies}
            onSelect={onSelectFrom}
            accessibilityLabel="From currency"
            testID="from-picker"
          />

          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={fromValue}
            onChangeText={onFromAmountChange}
            placeholder={fromSymbol}
            placeholderTextColor="#999"
            testID="from-input"
            accessibilityLabel={`Amount in ${from}`}
            inputAccessoryViewID={KEYBOARD_ACCESSORY_ID}
            returnKeyType="done"
          />

          <Text style={styles.sectionLabel}>to</Text>

          <Text style={styles.comparison} testID="comparison">
            {from} {fromSymbol}1.00 ={' '}
            {to} {toSymbol}
            {rate === null ? '—' : formatAmount(rate, to)}
          </Text>

          <CurrencyDropdown
            value={to}
            options={currencies}
            onSelect={onSelectTo}
            accessibilityLabel="To currency"
            testID="to-picker"
          />

          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={toValue}
            onChangeText={onToAmountChange}
            placeholder={toSymbol}
            placeholderTextColor="#999"
            testID="to-input"
            accessibilityLabel={`Amount in ${to}`}
            inputAccessoryViewID={KEYBOARD_ACCESSORY_ID}
            returnKeyType="done"
          />
        </ScrollView>
      </TouchableWithoutFeedback>

      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={KEYBOARD_ACCESSORY_ID}>
          <View style={styles.accessoryBar}>
            <Pressable
              onPress={Keyboard.dismiss}
              accessibilityRole="button"
              accessibilityLabel="Dismiss keyboard"
              hitSlop={10}
              testID="keyboard-done"
            >
              <Text style={styles.accessoryDone}>Done</Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF2',
  },
  header: {
    paddingBottom: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  body: {
    paddingHorizontal: 28,
    paddingTop: 24,
    gap: 18,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: '500',
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  comparison: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: -8,
  },
  accessoryBar: {
    backgroundColor: '#F4F4F7',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D1D1D6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'flex-end',
  },
  accessoryDone: {
    color: '#E4002B',
    fontSize: 16,
    fontWeight: '700',
  },
});

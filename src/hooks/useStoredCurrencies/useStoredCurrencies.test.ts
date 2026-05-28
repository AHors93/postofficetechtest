import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useStoredCurrencies } from './useStoredCurrencies';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('useStoredCurrencies', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('defaults to GBP/USD when nothing is stored', async () => {
    const { result } = renderHook(() => useStoredCurrencies());

    await waitFor(() => expect(result.current.hydrated).toBe(true));

    expect(result.current.from).toBe('GBP');
    expect(result.current.to).toBe('USD');
  });

  it('restores the stored pair on mount', async () => {
    await AsyncStorage.setItem(
      'currencies/v1',
      JSON.stringify({ from: 'EUR', to: 'JPY' }),
    );

    const { result } = renderHook(() => useStoredCurrencies());

    await waitFor(() => expect(result.current.hydrated).toBe(true));

    expect(result.current.from).toBe('EUR');
    expect(result.current.to).toBe('JPY');
  });

  it('persists changes via setFrom and setTo', async () => {
    const { result } = renderHook(() => useStoredCurrencies());

    await waitFor(() => expect(result.current.hydrated).toBe(true));

    act(() => result.current.setFrom('EUR'));
    act(() => result.current.setTo('JPY'));

    await waitFor(async () => {
      const stored = await AsyncStorage.getItem('currencies/v1');
      expect(stored).toBe(JSON.stringify({ from: 'EUR', to: 'JPY' }));
    });
  });

  it('falls back to defaults when stored data is corrupted', async () => {
    await AsyncStorage.setItem('currencies/v1', 'not json');

    const { result } = renderHook(() => useStoredCurrencies());

    await waitFor(() => expect(result.current.hydrated).toBe(true));

    expect(result.current.from).toBe('GBP');
    expect(result.current.to).toBe('USD');
  });
});

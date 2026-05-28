import { act, renderHook } from '@testing-library/react-native';

import { useConverter } from './useConverter';

const usdRates = {
  USD: { rate: 1.26, name: 'US Dollar', symbol: '$' },
};
const jpyRates = {
  JPY: { rate: 191.63, name: 'Japanese Yen', symbol: '¥' },
};

describe('useConverter', () => {
  it('seeds with 1 on the from side and derives the to side', () => {
    const { result } = renderHook(() =>
      useConverter({ from: 'GBP', to: 'USD', rates: usdRates }),
    );
    expect(result.current.fromValue).toBe('1');
    expect(result.current.toValue).toBe('1.26');
  });

  it('derives the to side when the from side is edited', () => {
    const { result } = renderHook(() =>
      useConverter({ from: 'GBP', to: 'USD', rates: usdRates }),
    );
    act(() => result.current.onFromAmountChange('100'));
    expect(result.current.fromValue).toBe('100');
    expect(result.current.toValue).toBe('126.00');
  });

  it('derives the from side when the to side is edited', () => {
    const { result } = renderHook(() =>
      useConverter({ from: 'GBP', to: 'USD', rates: usdRates }),
    );
    act(() => result.current.onToAmountChange('126'));
    expect(result.current.fromValue).toBe('100.00');
    expect(result.current.toValue).toBe('126');
  });

  it('formats JPY without decimals', () => {
    const { result } = renderHook(() =>
      useConverter({ from: 'GBP', to: 'JPY', rates: jpyRates }),
    );
    act(() => result.current.onFromAmountChange('1'));
    expect(result.current.toValue).toBe('192');
  });

  it('clears the derived side when the active input is empty', () => {
    const { result } = renderHook(() =>
      useConverter({ from: 'GBP', to: 'USD', rates: usdRates }),
    );
    act(() => result.current.onFromAmountChange(''));
    expect(result.current.toValue).toBe('');
  });

  it('returns a null rate when the to currency is not in rates', () => {
    const { result } = renderHook(() =>
      useConverter({ from: 'GBP', to: 'XYZ', rates: usdRates }),
    );
    expect(result.current.rate).toBeNull();
    expect(result.current.toValue).toBe('');
  });
});

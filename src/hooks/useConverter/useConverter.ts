import { useState } from 'react';

import type { RatesResponse } from '../../api/types';
import { convertFromTo, convertToFrom } from '../../utils/convert';
import { formatAmount, parseAmount } from '../../utils/format';

type ActiveSide = 'from' | 'to';

interface Args {
  from: string;
  to: string;
  rates: RatesResponse;
}

export interface ConverterState {
  rate: number | null;
  fromValue: string;
  toValue: string;
  onFromAmountChange: (value: string) => void;
  onToAmountChange: (value: string) => void;
}

export function useConverter({ from, to, rates }: Args): ConverterState {
  const [activeSide, setActiveSide] = useState<ActiveSide>('from');
  const [activeAmount, setActiveAmount] = useState('1');

  const rate = rates[to]?.rate ?? null;
  const parsedActive = parseAmount(activeAmount);

  const derivedValue =
    rate === null || parsedActive === null
      ? ''
      : activeSide === 'from'
        ? formatAmount(convertFromTo(parsedActive, rate), to)
        : formatAmount(convertToFrom(parsedActive, rate), from);

  return {
    rate,
    fromValue: activeSide === 'from' ? activeAmount : derivedValue,
    toValue: activeSide === 'to' ? activeAmount : derivedValue,
    onFromAmountChange: (value) => {
      setActiveSide('from');
      setActiveAmount(value);
    },
    onToAmountChange: (value) => {
      setActiveSide('to');
      setActiveAmount(value);
    },
  };
}

import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

import AUD from '../../../assets/flags/AUD.svg';
import CAD from '../../../assets/flags/CAD.svg';
import CHF from '../../../assets/flags/CHF.svg';
import CNY from '../../../assets/flags/CNY.svg';
import EUR from '../../../assets/flags/EUR.svg';
import GBP from '../../../assets/flags/GBP.svg';
import JPY from '../../../assets/flags/JPY.svg';
import NZD from '../../../assets/flags/NZD.svg';
import THB from '../../../assets/flags/THB.svg';
import USD from '../../../assets/flags/USD.svg';
import ZAR from '../../../assets/flags/ZAR.svg';

const FLAGS: Record<string, ComponentType<SvgProps>> = {
  AUD,
  CAD,
  CHF,
  CNY,
  EUR,
  GBP,
  JPY,
  NZD,
  THB,
  USD,
  ZAR,
};

interface Props {
  code: string;
  size?: number;
}

export function Flag({ code, size = 32 }: Props) {
  const Component = FLAGS[code];
  if (!Component) return null;
  return <Component width={size} height={size} />;
}

import Constants from 'expo-constants';

const MOCK_SERVER_PORT = 8000;

// When loaded by Expo Go, the bundle is served from the dev machine's LAN IP
// (e.g. "192.168.0.42:8081"). We reuse that host for the mock server so the
// reviewer never has to configure their IP.
function resolveApiHost(): string {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.hostUri ??
    Constants.linkingUri;
  const host = hostUri?.split('/')[0]?.split(':')[0];
  return host && host.length > 0 ? host : 'localhost';
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  `http://${resolveApiHost()}:${MOCK_SERVER_PORT}`;

export const API_KEY =
  process.env.EXPO_PUBLIC_API_KEY ?? '85f7ccfd-677a-4e5a-a5eb-21c19734edf7';

export const DEFAULT_FROM = 'GBP';
export const DEFAULT_TO = 'USD';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
  CAD: '$',
  JPY: '¥',
  NZD: '$',
  THB: '฿',
  CNY: '¥',
  AUD: '$',
  CHF: 'Fr',
  ZAR: 'R',
};

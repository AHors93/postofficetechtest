import { API_BASE_URL, API_KEY } from '../../config';
import type { CurrencyRate, RatesResponse } from '../types';

export async function fetchRates(base: string): Promise<RatesResponse> {
  const res = await fetch(`${API_BASE_URL}/rates/${base.toLowerCase()}`, {
    headers: { 'x-api-key': API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Rates request failed: ${res.status}`);
  }

  const data: unknown = await res.json();
  return parseRatesResponse(data);
}

function parseRatesResponse(data: unknown): RatesResponse {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid rates response: expected object');
  }

  const result: RatesResponse = {};
  for (const [code, value] of Object.entries(data as Record<string, unknown>)) {
    const rate = parseRate(value);
    if (rate) result[code] = rate;
  }
  return result;
}

function parseRate(value: unknown): CurrencyRate | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.rate !== 'number') return null;
  if (typeof record.name !== 'string') return null;
  if (typeof record.symbol !== 'string') return null;
  return { rate: record.rate, name: record.name, symbol: record.symbol };
}

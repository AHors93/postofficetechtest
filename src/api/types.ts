export interface CurrencyRate {
  rate: number;
  name: string;
  symbol: string;
}

export type RatesResponse = Record<string, CurrencyRate>;

import { decimalsFor, formatAmount, parseAmount } from './format';

describe('decimalsFor', () => {
  it('returns 0 for JPY', () => {
    expect(decimalsFor('JPY')).toBe(0);
  });

  it('returns 2 for other currencies', () => {
    expect(decimalsFor('USD')).toBe(2);
    expect(decimalsFor('GBP')).toBe(2);
    expect(decimalsFor('EUR')).toBe(2);
  });
});

describe('formatAmount', () => {
  it('formats to 2 decimals by default', () => {
    expect(formatAmount(123.456, 'USD')).toBe('123.46');
    expect(formatAmount(0, 'GBP')).toBe('0.00');
  });

  it('formats JPY with no decimals', () => {
    expect(formatAmount(123.7, 'JPY')).toBe('124');
    expect(formatAmount(0, 'JPY')).toBe('0');
  });
});

describe('parseAmount', () => {
  it('parses a valid number string', () => {
    expect(parseAmount('12.5')).toBe(12.5);
    expect(parseAmount('100')).toBe(100);
  });

  it('normalises a comma decimal separator', () => {
    expect(parseAmount('12,5')).toBe(12.5);
  });

  it('returns null for empty input', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('   ')).toBeNull();
  });

  it('returns null for non-numeric input', () => {
    expect(parseAmount('abc')).toBeNull();
  });
});

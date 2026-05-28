import { convertFromTo, convertToFrom } from './convert';

describe('convertFromTo', () => {
  it('multiplies amount by rate', () => {
    expect(convertFromTo(100, 1.26)).toBeCloseTo(126);
    expect(convertFromTo(50, 1.16)).toBeCloseTo(58);
  });

  it('returns 0 when amount is 0', () => {
    expect(convertFromTo(0, 1.26)).toBe(0);
  });
});

describe('convertToFrom', () => {
  it('divides amount by rate', () => {
    expect(convertToFrom(126, 1.26)).toBeCloseTo(100);
    expect(convertToFrom(58, 1.16)).toBeCloseTo(50);
  });

  it('round-trips with convertFromTo', () => {
    const from = 100;
    const rate = 1.2638436;
    const to = convertFromTo(from, rate);
    expect(convertToFrom(to, rate)).toBeCloseTo(from);
  });
});

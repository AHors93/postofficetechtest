export function convertFromTo(fromAmount: number, rate: number): number {
  return fromAmount * rate;
}

export function convertToFrom(toAmount: number, rate: number): number {
  return toAmount / rate;
}

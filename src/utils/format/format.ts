export function decimalsFor(code: string): number {
  return code === 'JPY' ? 0 : 2;
}

export function formatAmount(value: number, code: string): string {
  return value.toFixed(decimalsFor(code));
}

export function parseAmount(input: string): number | null {
  const normalized = input.replace(',', '.').trim();
  if (normalized === '') return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

// client/src/utils/formatNumber.ts
export function formatCompactNumber(
  value: number,
  opts: { maxFractionDigits?: number } = {}
) {
  const { maxFractionDigits = 1 } = opts;
  if (!Number.isFinite(value)) return "0";

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  const format = (n: number, suffix: string) =>
    `${sign}${n.toLocaleString(undefined, {
      maximumFractionDigits: maxFractionDigits,
      minimumFractionDigits: 0,
    })}${suffix}`;

  if (abs >= 1_000_000_000_000) return format(abs / 1_000_000_000_000, "T");
  if (abs >= 1_000_000_000) return format(abs / 1_000_000_000, "B");
  if (abs >= 1_000_000) return format(abs / 1_000_000, "M");
  if (abs >= 1_000) return format(abs / 1_000, "K");
  return value.toLocaleString();
}

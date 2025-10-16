export function formatGbp(value: number | string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

import extenso from "extenso";

const numberFormat = new Intl.NumberFormat("pt-br");

export function formatNumber(number: number): string {
  return numberFormat.format(number);
}

export function numberToWords(
  number: number,
  options?: { gender?: "m" | "f" }
): string {
  return extenso(number, { number: { gender: options?.gender } });
}

const numberFormat = new Intl.NumberFormat("pt-br");

export function formatNumber(number: number): string {
  return numberFormat.format(number);
}

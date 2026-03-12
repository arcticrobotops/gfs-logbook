/**
 * Format a price number for display.
 * Whole-dollar amounts omit decimals; fractional amounts show two decimal places.
 */
export function formatPrice(amount: number): string {
  return amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
}

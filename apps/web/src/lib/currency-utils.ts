/**
 * Utility for formatting currency symbols based on country/region.
 * Defaults to '$' if specialized symbol is not found.
 */

const CURRENCY_MAP: Record<string, string> = {
  'PE': 'S/', // Perú
  'MX': '$',  // México
  'CL': '$',  // Chile
  'CO': '$',  // Colombia
  'AR': '$',  // Argentina
  'BR': 'R$', // Brasil
  'US': '$',  // USA
};

/**
 * Returns the currency symbol for a given country code.
 * @param countryCode ISO 3166-1 alpha-2 country code.
 */
export function getCurrencySymbol(countryCode: string = 'PE'): string {
  return CURRENCY_MAP[countryCode.toUpperCase()] || '$';
}

/**
 * Formats an amount with the appropriate currency symbol.
 * @param amount The numeric amount.
 * @param countryCode ISO 3166-1 alpha-2 country code.
 */
export function formatCurrency(amount: number | string, countryCode: string = 'PE'): string {
  const symbol = getCurrencySymbol(countryCode);
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
  
  if (isNaN(numericAmount)) return `${symbol} 0.00`;
  
  return `${symbol} ${numericAmount.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Format a price number for display.
 * Whole-dollar amounts omit decimals; fractional amounts show two decimal places.
 * Returns '0' for NaN values.
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount)) return '0';
  return amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
}

/**
 * Basic HTML sanitizer that strips <script> tags, event handler attributes,
 * and other dangerous patterns from HTML strings.
 */
export function sanitizeHtml(html: string): string {
  return html
    // Remove <script> tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove standalone <script> tags (unclosed)
    .replace(/<script\b[^>]*>/gi, '')
    // Remove event handler attributes (on*)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Remove javascript: URLs in href/src/action attributes
    .replace(/(href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '$1=""')
    // Remove <iframe> tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<iframe\b[^>]*>/gi, '')
    // Remove <object> tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<object\b[^>]*>/gi, '')
    // Remove <embed> tags
    .replace(/<embed\b[^>]*>/gi, '');
}

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
 * #4: Allowlist-based HTML sanitizer.
 * Only permits safe tags: p, br, strong, em, b, i, ul, ol, li, a, h2, h3, h4, span, div.
 * Strips ALL attributes except href on <a> tags (validated to http/https only).
 * All other tags and attributes are removed entirely.
 */
const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li',
  'a', 'h2', 'h3', 'h4', 'span', 'div',
]);

export function sanitizeHtml(html: string): string {
  // Replace all HTML tags with sanitized versions
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)?\/?>/gi, (match, tagName: string, attrs: string) => {
    const tag = tagName.toLowerCase();

    // Strip disallowed tags entirely
    if (!ALLOWED_TAGS.has(tag)) {
      return '';
    }

    // Check if this is a closing tag
    if (match.startsWith('</')) {
      return `</${tag}>`;
    }

    // Self-closing check (e.g. <br />)
    const selfClosing = tag === 'br';

    // For <a> tags, extract and validate href (http/https only)
    if (tag === 'a' && attrs) {
      const hrefMatch = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/i);
      if (hrefMatch) {
        const href = hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? '';
        // Only allow http:// and https:// URLs
        if (/^https?:\/\//i.test(href)) {
          const safeHref = href
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;');
          return `<a href="${safeHref}">`;
        }
      }
      // No valid href or non-http href — render <a> without attributes
      return '<a>';
    }

    // All other allowed tags — strip all attributes
    return selfClosing ? `<${tag} />` : `<${tag}>`;
  });
}

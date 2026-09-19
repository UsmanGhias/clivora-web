/**
 * Ultra-robust HTML and MS Word rich-text cleaner for job descriptions,
 * markdown summaries, and portal content.
 *
 * Strips XML tags, Office conditional comments, raw data attributes,
 * JSON metadata artifacts, and normalizes bullet lists cleanly.
 */
export function cleanText(str?: string | null): string {
  if (!str) return "";

  let text = str;

  // 1. Remove XML/HTML comments & Office conditionals (mso)
  text = text.replace(/<!--[\s\S]*?-->/g, "");
  text = text.replace(/<!\[[\s\S]*?\]>/g, "");

  // 2. Remove script and style blocks
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  // 3. Remove raw Office/Word list metadata blobs e.g. data-list-defn-props="{...}"
  text = text.replace(/data-[a-z0-9_-]+="\{[^}]*\}"/gi, "");
  text = text.replace(/data-[a-z0-9_-]+='\{[^']*\}'/gi, "");
  text = text.replace(/data-[a-z0-9_-]+="[^"]*"/gi, "");
  text = text.replace(/data-[a-z0-9_-]+='[^']*'/gi, "");
  text = text.replace(/\{"\d+":\s*\d+[^}]*\}/g, "");
  text = text.replace(/\{"33555[^}]*\}/g, "");

  // 4. Mark heading elements with double newlines
  text = text.replace(/<h[1-6][^>]*>/gi, "\n\n### ");
  text = text.replace(/<\/h[1-6]>/gi, "\n\n");

  // 5. Convert all <li> elements with any attributes to uniform bullet points
  text = text.replace(/<li(\s+[^>]*)?>/gi, "\n• ");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<br\s*[\/]?>/gi, "\n");
  text = text.replace(/<\/(p|div|tr|table|ul|ol|section|article)>/gi, "\n\n");

  // 6. Strip any remaining standard or malformed HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // 7. Decode all HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#47;/g, "/")
    .replace(/&nbsp;/g, " ")
    .replace(/&bull;/g, "•")
    .replace(/&middot;/g, "·")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));

  // 8. Re-run bullet and tag cleanup on any entities that decoded into markup
  text = text.replace(/<li(\s+[^>]*)?>/gi, "\n• ");
  text = text.replace(/<[^>]+>/g, " ");

  // 9. Clean leftover broken markup strings
  text = text.replace(/<li\b[^>]*$/gim, "\n• ");
  text = text.replace(/<\/?[a-z0-9_-]+(\s+[^>]*)?>/gi, " ");

  // 10. Strip aggregator watermarks and scraper footers
  text = text.replace(/Find\s+(?:more\s+)?(?:English\s+Speaking\s+)?Jobs\s+in\s+[^.\n]+on\s+Arbeitnow/gi, "");
  text = text.replace(/Find\s+Jobs\s+on\s+Arbeitnow/gi, "");
  text = text.replace(/Posted\s+on\s+Remotive/gi, "");

  // 11. Strip multi-language personal data / GDPR legal blocks
  text = text.replace(/(?:🇫🇷|🇬🇧|🇩🇪)?\s*(?:Données personnelles|Personenbezogene Daten|Personal Data\s+Pennylane)[\s\S]*?(?=(?:\n\n[A-Z]|$))/gi, "");

  // 12. Strip recruitment scam warnings that clutter candidate reading
  text = text.replace(
    /(?:Important\s+information\s+for\s+candidates|Recruitment\s+scam\s+attempts|Beware\s+of\s+(?:recruitment\s+)?scams)[\s\S]*?(?:report\s+it\s+to\s+us\s+immediately\s*\.?|fraudulent\s*\.?)/gi,
    ""
  );
  text = text.replace(
    /Applications\s+through\s+official\s+channels\s+only[\s\S]*?(?:report\s+it\s+to\s+us\s+immediately\s*\.?|fraudulent\s*\.?)/gi,
    ""
  );
  text = text.replace(
    /We\s+invite\s+you\s+to\s+not\s+respond\s+and\s+to\s+report\s+it\s+to\s+us\s+immediately\s*\.?/gi,
    ""
  );

  // 13. Convert inline emojis used as bullet points in scrapers
  text = text.replace(/(\s+)([\p{Extended_Pictographic}\u200d]+)(\s+[A-Z])/gu, "\n• $3");

  // 14. Standardize typography per Humanizer guidelines (no em/en dashes)
  text = text.replace(/[\u2014\u2013]/g, "-");
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n[ \t]+/g, "\n");
  text = text.replace(/\n\s*\n\s*\n+/g, "\n\n");

  return text.trim();
}

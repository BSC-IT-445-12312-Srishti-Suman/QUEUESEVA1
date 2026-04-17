/**
 * Normalizes a string by removing diacritics (accents).
 * e.g., "Bānka" -> "Banka"
 */
export const normalizeString = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Checks if a string contains another string, insensitive to case and diacritics.
 */
export const fuzzySearch = (text: string, query: string): boolean => {
  const normalizedText = normalizeString(text.toLowerCase());
  const normalizedQuery = normalizeString(query.toLowerCase());
  return normalizedText.includes(normalizedQuery);
};

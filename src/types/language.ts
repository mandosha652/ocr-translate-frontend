interface Language {
  code: string;
  name: string;
}

// Languages supported by backend - MUST match backend's app/core/languages.py
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'pl', name: 'Polish' },
];

const LANG_MAP = new Map(SUPPORTED_LANGUAGES.map(l => [l.code, l.name]));

/** Returns the full language name for a code, e.g. "de" → "German". Falls back to uppercase code. */
export function langName(code: string): string {
  return LANG_MAP.get(code.toLowerCase()) ?? code.toUpperCase();
}

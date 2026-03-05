import { FREE_TIER_MAX_TARGET_LANGUAGES } from '@/lib/constants';
import { SUPPORTED_LANGUAGES } from '@/types';

export function useLanguageSelection(
  selectedLanguages: string[],
  onChange: (languages: string[]) => void,
  maxLanguages: number = FREE_TIER_MAX_TARGET_LANGUAGES
) {
  const toggleLanguage = (code: string) => {
    if (selectedLanguages.includes(code)) {
      onChange(selectedLanguages.filter(l => l !== code));
    } else if (selectedLanguages.length < maxLanguages) {
      onChange([...selectedLanguages, code]);
    }
  };

  const removeLanguage = (code: string) => {
    onChange(selectedLanguages.filter(l => l !== code));
  };

  const getLanguageName = (code: string) => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code;
  };

  const isLanguageDisabled = (code: string) => {
    const isSelected = selectedLanguages.includes(code);
    return !isSelected && selectedLanguages.length >= maxLanguages;
  };

  return {
    toggleLanguage,
    removeLanguage,
    getLanguageName,
    isLanguageDisabled,
  };
}

'use client';

import { Check, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguageSelection } from '@/hooks/batch/useLanguageSelection';
import { FREE_TIER_MAX_TARGET_LANGUAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { SUPPORTED_LANGUAGES } from '@/types';

interface MultiLanguageSelectProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
  label?: string;
  disabled?: boolean;
  maxLanguages?: number;
}

export function MultiLanguageSelect({
  selectedLanguages,
  onChange,
  label,
  disabled,
  maxLanguages = FREE_TIER_MAX_TARGET_LANGUAGES,
}: MultiLanguageSelectProps) {
  const {
    toggleLanguage,
    removeLanguage,
    getLanguageName,
    isLanguageDisabled,
  } = useLanguageSelection(selectedLanguages, onChange, maxLanguages);

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

      {selectedLanguages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLanguages.map(code => (
            <Badge
              key={code}
              variant="secondary"
              className="gap-1 pr-1 pl-2 text-sm"
            >
              {getLanguageName(code)}
              <button
                onClick={() => removeLanguage(code)}
                disabled={disabled}
                aria-label={`Remove ${getLanguageName(code)}`}
                title={`Remove ${getLanguageName(code)}`}
                className="hover:bg-muted-foreground/20 ml-1 cursor-pointer rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="rounded-lg border p-3">
        <p className="text-muted-foreground mb-2 text-xs">
          Select up to {maxLanguages} languages ({selectedLanguages.length}/
          {maxLanguages})
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {SUPPORTED_LANGUAGES.map(lang => {
            const isSelected = selectedLanguages.includes(lang.code);
            const isDisabledLang = disabled || isLanguageDisabled(lang.code);

            return (
              <Button
                key={lang.code}
                variant={isSelected ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  'justify-start gap-2',
                  isSelected && 'bg-primary/10 text-primary hover:bg-primary/20'
                )}
                onClick={() => toggleLanguage(lang.code)}
                disabled={isDisabledLang}
              >
                {isSelected ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span className="w-3" />
                )}
                {lang.name}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SUPPORTED_LANGUAGES } from '@/types';

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  showAuto?: boolean;
}

export function LanguageSelect({
  value,
  onChange,
  label,
  placeholder = 'Select language',
  disabled,
  showAuto,
}: LanguageSelectProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {showAuto && <SelectItem value="auto">Auto-detect</SelectItem>}
          {SUPPORTED_LANGUAGES.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

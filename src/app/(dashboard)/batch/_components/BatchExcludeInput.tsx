'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BatchExcludeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function BatchExcludeInput({
  value,
  onChange,
  disabled,
}: BatchExcludeInputProps) {
  const entries = value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2">
      <Label htmlFor="excludeText">
        Exclude Text{' '}
        <span className="text-muted-foreground font-normal">(optional)</span>
      </Label>
      <Input
        id="excludeText"
        placeholder="e.g., BRAND,@handle,Logo"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
      {value.trim() &&
        (value.includes(',,') ? (
          <p className="text-xs text-amber-600">
            Remove consecutive commas — empty entries are ignored
          </p>
        ) : entries.some(e => e.length > 50) ? (
          <p className="text-xs text-amber-600">
            Some entries are very long — only exact matches work
          </p>
        ) : (
          <p className="text-muted-foreground text-xs">
            {entries.length} entr
            {entries.length === 1 ? 'y' : 'ies'} will be excluded
          </p>
        ))}
    </div>
  );
}

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BatchWebhookInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

function isUrlValid(url: string): boolean {
  try {
    new URL(url.trim());
    return true;
  } catch {
    return false;
  }
}

export function BatchWebhookInput({
  value,
  onChange,
  disabled,
}: BatchWebhookInputProps) {
  const trimmed = value.trim();
  const valid = trimmed ? isUrlValid(trimmed) : true;

  return (
    <div className="space-y-2">
      <Label htmlFor="webhookUrl">
        Webhook URL{' '}
        <span className="text-muted-foreground font-normal">(optional)</span>
      </Label>
      <Input
        id="webhookUrl"
        type="url"
        placeholder="https://your-server.com/webhook"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
      {trimmed &&
        (valid ? (
          <p className="text-muted-foreground text-xs">
            POST will be sent when batch finishes
          </p>
        ) : (
          <p className="text-destructive text-xs">
            Enter a valid URL (e.g. https://…)
          </p>
        ))}
    </div>
  );
}

export { isUrlValid as isWebhookUrlValid };

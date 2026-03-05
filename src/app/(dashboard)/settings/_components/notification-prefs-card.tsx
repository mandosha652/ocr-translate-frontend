'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/shared/useLocalStorage';
import {
  NOTIFICATION_PREFS_DEFAULTS,
  NOTIFICATION_PREFS_KEY,
} from '@/lib/constants/ui';

interface NotificationPrefs {
  batch_complete_email: boolean;
  weekly_digest: boolean;
  product_updates: boolean;
  quota_warnings: boolean;
}

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <Label htmlFor={id} className="cursor-pointer font-medium">
          {label}
        </Label>
        <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`focus-visible:ring-ring relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
          checked ? 'bg-primary' : 'bg-input'
        }`}
      >
        <span
          className={`bg-background pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

const DEFAULTS: NotificationPrefs = {
  batch_complete_email: NOTIFICATION_PREFS_DEFAULTS.batch_complete_email,
  weekly_digest: false,
  product_updates: true,
  quota_warnings: true,
};

export function NotificationPrefsCard() {
  const [saved, setSaved] = useLocalStorage<NotificationPrefs>(
    NOTIFICATION_PREFS_KEY,
    DEFAULTS
  );
  const [prefs, setPrefs] = useState<NotificationPrefs>(saved);
  const dirty = JSON.stringify(prefs) !== JSON.stringify(saved);

  function update(key: keyof NotificationPrefs, value: boolean) {
    setPrefs(p => ({ ...p, [key]: value }));
  }

  function handleSave() {
    setSaved(prefs);
    toast.success('Notification preferences saved');
  }

  const rows: Array<{
    key: keyof NotificationPrefs;
    label: string;
    description: string;
  }> = [
    {
      key: 'batch_complete_email',
      label: 'Batch complete email',
      description: 'Get an email when a batch job finishes processing.',
    },
    {
      key: 'quota_warnings',
      label: 'Quota warnings',
      description: "In-app alerts when you're approaching your monthly limit.",
    },
    {
      key: 'product_updates',
      label: 'Product updates',
      description: 'Occasional emails about new features and improvements.',
    },
    {
      key: 'weekly_digest',
      label: 'Weekly digest',
      description: 'A weekly summary of your translation activity.',
    },
  ];

  return (
    <Card id="notifications">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <CardTitle>Notifications</CardTitle>
        </div>
        <CardDescription>
          Choose what you want to be notified about
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {rows.map(row => (
            <ToggleRow
              key={row.key}
              id={`notif-${row.key}`}
              label={row.label}
              description={row.description}
              checked={prefs[row.key]}
              onChange={v => update(row.key, v)}
            />
          ))}
        </div>
        {dirty ? (
          <div className="mt-4">
            <Button size="sm" onClick={handleSave}>
              Save preferences
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

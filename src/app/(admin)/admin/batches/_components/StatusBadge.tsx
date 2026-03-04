'use client';

import { ADMIN_BATCH_STATUS_CONFIG } from '@/lib/constants/admin';

export function StatusBadge({ status }: { status: string }) {
  const config = ADMIN_BATCH_STATUS_CONFIG[status] || {
    label: status,
    className: 'border-border text-muted-foreground',
  };

  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
}

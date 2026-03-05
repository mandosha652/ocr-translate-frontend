import type { BatchStatus } from '@/types/batch';

export const NOTIFICATION_PREFS_KEY = 'notification_prefs';
export const NOTIFICATION_PREFS_DEFAULTS = {
  batch_complete_toast: true,
  batch_complete_push: true,
  batch_complete_email: false,
};

export const BATCH_STATUS_CONFIG: Record<
  BatchStatus,
  {
    label: string;
    color: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  pending: { label: 'Pending', color: 'text-amber-600', variant: 'outline' },
  processing: {
    label: 'Processing',
    color: 'text-blue-600',
    variant: 'secondary',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-600',
    variant: 'default',
  },
  partially_completed: {
    label: 'Partial',
    color: 'text-amber-600',
    variant: 'outline',
  },
  failed: {
    label: 'Failed',
    color: 'text-destructive',
    variant: 'destructive',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-muted-foreground',
    variant: 'outline',
  },
};

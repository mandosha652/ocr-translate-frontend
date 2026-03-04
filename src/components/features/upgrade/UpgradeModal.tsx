'use client';

import { ArrowRight, Check, Zap } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onClose: () => void;
  /** What limit was hit — shown in the description */
  reason?: string;
}

const PRO_FEATURES = [
  'Higher image & translation limits',
  'Batch processing (up to 20 images)',
  'Up to 10 target languages per batch',
  'Priority processing queue',
  'Full API access with higher rate limits',
];

export function UpgradeModal({ open, onClose, reason }: Props) {
  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              Upgrade required
            </Badge>
          </div>
          <DialogTitle className="text-xl">
            You&apos;ve hit your limit
          </DialogTitle>
          <DialogDescription className="text-base">
            {reason
              ? reason
              : "You've reached your plan's limit for this month. Upgrade to Pro to keep going."}
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 py-2">
          {PRO_FEATURES.map(f => (
            <li key={f} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 shrink-0 text-green-500" />
              {f}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/pricing" className="flex-1" onClick={onClose}>
            <Button className="w-full gap-2">
              View plans <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" onClick={onClose}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

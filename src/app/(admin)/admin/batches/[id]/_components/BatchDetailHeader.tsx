'use client';

import { ArrowLeft, RotateCcw, Trash2, XCircle } from 'lucide-react';
import Link from 'next/link';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { StatusBadge } from '../_components/StatusBadge';

interface BatchDetailHeaderProps {
  batchId: string;
  status: string;
  canCancel: boolean;
  canRetry: boolean;
  onCancel: () => void;
  onRetry: () => void;
  onDelete: () => void;
  isPendingDelete: boolean;
  isPendingCancel: boolean;
  isPendingRetry: boolean;
}

export function BatchDetailHeader({
  batchId,
  status,
  canCancel,
  canRetry,
  onCancel,
  onRetry,
  onDelete,
  isPendingDelete,
  isPendingCancel,
  isPendingRetry,
}: BatchDetailHeaderProps) {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <Link href="/admin/batches" className="mt-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Batch Detail</h1>
          <StatusBadge status={status} />
        </div>
        <p className="text-muted-foreground mt-0.5 font-mono text-xs break-all">
          {batchId}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isPendingCancel}
            className="gap-1.5 border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
          >
            <XCircle className="h-3.5 w-3.5" />
            {isPendingCancel ? 'Cancelling...' : 'Cancel'}
          </Button>
        )}
        {canRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isPendingRetry}
            className="gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {isPendingRetry ? 'Queuing...' : 'Retry'}
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={isPendingDelete}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this batch?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes the batch and all its image results.
                Cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

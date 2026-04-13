'use client';

import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminDevReset } from '@/hooks';

export function DevResetSection() {
  const devReset = useAdminDevReset();
  const [open, setOpen] = useState(false);

  const handleReset = async () => {
    try {
      const result = await devReset.mutateAsync();
      setOpen(false);
      toast.success('Dev reset complete', {
        description: `${result.batches_deleted} batches · ${result.single_translations_deleted} singles · ${result.r2_files_deleted} R2 files · ${result.queues_purged} queued · ${result.local_files_deleted} local files`,
      });
    } catch {
      toast.error('Dev reset failed');
    }
  };

  return (
    <Card className="border-destructive/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="text-destructive h-4 w-4" />
          Dev Reset
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Delete all batches, images, translations, usage logs, and R2 files.
          User accounts and API keys are preserved.
        </p>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="w-full">
              Reset everything
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all batches, images, translations,
                usage logs, and R2 files. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReset}
                disabled={devReset.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {devReset.isPending ? 'Resetting...' : 'Yes, reset everything'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

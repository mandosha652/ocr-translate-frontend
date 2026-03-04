'use client';

import { FolderX } from 'lucide-react';
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
import { useAdminWipeTenantFiles } from '@/hooks';

interface WipeTenantFilesDialogProps {
  userId: string;
}

export function WipeTenantFilesDialog({ userId }: WipeTenantFilesDialogProps) {
  const wipeTenantFiles = useAdminWipeTenantFiles();

  const handleWipe = () => {
    wipeTenantFiles.mutate(userId, {
      onSuccess: () => toast.success('Tenant files wiped'),
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <FolderX className="h-3.5 w-3.5" />
          Wipe Files
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Wipe tenant files</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete all stored files for this user. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleWipe}
            disabled={wipeTenantFiles.isPending}
          >
            {wipeTenantFiles.isPending ? 'Wiping...' : 'Wipe Files'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

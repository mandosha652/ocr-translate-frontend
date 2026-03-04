'use client';

import { format } from 'date-fns';
import { Key, XCircle } from 'lucide-react';
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
import { useAdminRevokeUserApiKey } from '@/hooks';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  last_used_at: string | null;
}

interface ApiKeyListProps {
  userId: string;
  apiKeys: ApiKey[] | undefined;
}

export function ApiKeyList({ userId, apiKeys }: ApiKeyListProps) {
  const revokeApiKey = useAdminRevokeUserApiKey();

  if (!apiKeys || apiKeys.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <Key className="text-muted-foreground/40 h-8 w-8" />
        <p className="text-muted-foreground text-sm">No API keys found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {apiKeys.map(k => (
        <div
          key={k.id}
          className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
        >
          <Key className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="truncate text-sm font-medium">{k.name}</span>
            <span className="text-muted-foreground bg-muted shrink-0 rounded px-1.5 py-0.5 font-mono text-xs">
              {k.prefix}…
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-muted-foreground hidden text-xs sm:inline">
              {k.last_used_at
                ? `used ${format(new Date(k.last_used_at), 'MMM d')}`
                : 'never used'}
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-7 w-7"
                  disabled={revokeApiKey.isPending}
                  title="Revoke key"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Revoke key &ldquo;{k.name}&rdquo;?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    The key will stop working immediately. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      revokeApiKey.mutate(
                        { userId, keyId: k.id },
                        { onSuccess: () => toast.success('API key revoked') }
                      )
                    }
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Revoke
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}

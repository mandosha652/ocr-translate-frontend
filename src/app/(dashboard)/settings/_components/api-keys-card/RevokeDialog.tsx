'use client';

import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ApiKey } from '@/types';

import { useApiKeysContext } from './ApiKeysContext';

interface RevokeDialogProps {
  apiKey: ApiKey;
}

export function RevokeDialog({ apiKey }: RevokeDialogProps) {
  const { state, dispatch, revokeApiKey, handleRevokeKey } =
    useApiKeysContext();

  return (
    <Dialog
      open={state.revokeConfirmId === apiKey.id}
      onOpenChange={open =>
        dispatch({ type: 'SET_REVOKE_CONFIRM', id: open ? apiKey.id : null })
      }
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Revoke key">
          <Trash2 className="text-destructive h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-5 w-5" />
            Revoke API Key
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke{' '}
            <span className="font-medium">{apiKey.name}</span>? Any integrations
            using this key will stop working immediately. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => dispatch({ type: 'SET_REVOKE_CONFIRM', id: null })}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleRevokeKey(apiKey.id)}
            disabled={revokeApiKey.isPending}
          >
            {revokeApiKey.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Revoke Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

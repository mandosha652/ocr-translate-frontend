'use client';

import { Loader2, Plus } from 'lucide-react';

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

import { useApiKeysContext } from './ApiKeysContext';
import { CreateKeyForm } from './CreateKeyForm';

export function CreateKeyDialog() {
  const { state, dispatch, createApiKey, handleCreateKey } =
    useApiKeysContext();

  return (
    <Dialog
      open={state.dialogOpen}
      onOpenChange={open => {
        if (!open && state.newKeyShown && !state.copied) return;
        if (open) dispatch({ type: 'OPEN_DIALOG' });
        else dispatch({ type: 'CLOSE_DIALOG' });
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {state.newKeyShown ? 'API Key Created' : 'Create API Key'}
          </DialogTitle>
          <DialogDescription>
            {state.newKeyShown
              ? "Copy your API key now. You won't be able to see it again."
              : 'Create a new API key for programmatic access.'}
          </DialogDescription>
        </DialogHeader>

        <CreateKeyForm />

        <DialogFooter>
          {state.newKeyShown ? (
            <Button
              onClick={() => dispatch({ type: 'CLOSE_DIALOG' })}
              disabled={!state.copied}
            >
              {state.copied ? 'Close' : 'Copy key first'}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => dispatch({ type: 'CLOSE_DIALOG' })}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateKey}
                disabled={createApiKey.isPending}
              >
                {createApiKey.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

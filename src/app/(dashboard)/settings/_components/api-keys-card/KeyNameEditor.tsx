'use client';

import { Check, Loader2, Pencil, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ApiKey } from '@/types';

import { useApiKeysContext } from './ApiKeysContext';

interface KeyNameEditorProps {
  apiKey: ApiKey;
  isRenaming: boolean;
}

export function KeyNameEditor({ apiKey, isRenaming }: KeyNameEditorProps) {
  const { state, dispatch, renameApiKey, handleConfirmRename } =
    useApiKeysContext();

  if (!isRenaming) {
    return (
      <div className="flex items-center gap-1">
        <p className="font-medium">{apiKey.name}</p>
        {apiKey.is_active && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
            onClick={() =>
              dispatch({
                type: 'START_RENAME',
                keyId: apiKey.id,
                name: apiKey.name,
              })
            }
            aria-label="Rename key"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        className="h-7 w-full max-w-40 text-sm"
        value={state.renameValue}
        onChange={e =>
          dispatch({ type: 'SET_RENAME_VALUE', value: e.target.value })
        }
        onKeyDown={e => {
          if (e.key === 'Enter') handleConfirmRename(apiKey.id);
          if (e.key === 'Escape') dispatch({ type: 'CANCEL_RENAME' });
        }}
        autoFocus
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={renameApiKey.isPending}
        onClick={() => handleConfirmRename(apiKey.id)}
        aria-label="Save name"
      >
        {renameApiKey.isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => dispatch({ type: 'CANCEL_RENAME' })}
        aria-label="Cancel rename"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

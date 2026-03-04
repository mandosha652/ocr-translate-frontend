'use client';

import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useApiKeysContext } from './ApiKeysContext';

export function CreateKeyForm() {
  const { state, dispatch, handleCopyKey } = useApiKeysContext();

  if (state.newKeyShown) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={state.newKeyShown}
            readOnly
            className="font-mono text-sm"
            onFocus={e => e.target.select()}
          />
          <Button
            variant={state.copied ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleCopyKey(state.newKeyShown!)}
            aria-label="Copy API key"
          >
            {state.copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {state.copied ? (
          <p className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
            <Check className="h-3.5 w-3.5" />
            Key copied — you can now close this dialog.
          </p>
        ) : (
          <p className="text-destructive text-sm">
            Copy your API key before closing — you won&apos;t see it again.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="keyName">Key Name</Label>
        <Input
          id="keyName"
          placeholder="e.g., Production Key"
          value={state.newKeyName}
          onChange={e =>
            dispatch({ type: 'SET_NEW_KEY_NAME', value: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="keyExpiry">Expires in (days)</Label>
        <Input
          id="keyExpiry"
          type="number"
          min="1"
          placeholder="Never (leave blank)"
          value={state.newKeyExpiryDays}
          onChange={e =>
            dispatch({
              type: 'SET_NEW_KEY_EXPIRY',
              value: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}

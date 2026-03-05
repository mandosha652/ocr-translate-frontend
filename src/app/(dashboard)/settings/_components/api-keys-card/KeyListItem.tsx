'use client';

import { Key, Loader2, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatLastUsed } from '@/lib/utils/date';
import type { ApiKey } from '@/types';

import { useApiKeysContext } from './ApiKeysContext';
import { KeyNameEditor } from './KeyNameEditor';
import { KeyStatsPanel } from './KeyStatsPanel';
import { RevokeDialog } from './RevokeDialog';

interface KeyListItemProps {
  apiKey: ApiKey;
}

export function KeyListItem({ apiKey }: KeyListItemProps) {
  const { state, handleRotateKey } = useApiKeysContext();
  const isRenaming = state.renamingKeyId === apiKey.id;
  const isRotating = state.rotatingKeyId === apiKey.id;

  return (
    <div className="group hover:bg-muted/30 flex flex-col gap-3 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
          <Key className="text-muted-foreground h-5 w-5" />
        </div>
        <div>
          <KeyNameEditor apiKey={apiKey} isRenaming={isRenaming} />
          <p className="text-muted-foreground text-sm">{apiKey.prefix}...</p>
          <p className="text-muted-foreground text-xs">
            {formatLastUsed(apiKey.last_used_at)}
          </p>
          <KeyStatsPanel
            keyId={apiKey.id}
            expiresAt={apiKey.expires_at ?? undefined}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={apiKey.is_active ? 'default' : 'secondary'}>
          {apiKey.is_active ? 'Active' : 'Revoked'}
        </Badge>
        {apiKey.is_active ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Rotate key"
            disabled={isRotating}
            onClick={() => handleRotateKey(apiKey.id, apiKey.name)}
          >
            {isRotating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        ) : null}
        {apiKey.is_active ? <RevokeDialog apiKey={apiKey} /> : null}
      </div>
    </div>
  );
}

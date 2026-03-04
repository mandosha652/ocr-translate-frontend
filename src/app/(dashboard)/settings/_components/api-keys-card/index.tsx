'use client';

import { AlertTriangle, Key, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ApiKeysProvider, useApiKeysContext } from './ApiKeysContext';
import { CreateKeyDialog } from './CreateKeyDialog';
import { KeyListItem } from './KeyListItem';

function ApiKeysCardInner() {
  const { apiKeys, isLoadingKeys, keysError, refetchKeys } =
    useApiKeysContext();

  return (
    <Card id="api-keys">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Manage your API keys for programmatic access
            </CardDescription>
          </div>
          <CreateKeyDialog />
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingKeys ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : keysError ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="text-destructive h-8 w-8" />
            <p className="mt-2 font-medium">Couldn&apos;t load your API keys</p>
            <p className="text-muted-foreground text-sm">
              Check your connection and try again
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={refetchKeys}
            >
              Retry
            </Button>
          </div>
        ) : apiKeys && apiKeys.length > 0 ? (
          <div className="space-y-4">
            {apiKeys.map(key => (
              <KeyListItem key={key.id} apiKey={key} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Key className="text-muted-foreground h-8 w-8" />
            <p className="text-muted-foreground mt-2">No API keys yet</p>
            <p className="text-muted-foreground text-sm">
              Create an API key to access the API programmatically
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ApiKeysCard() {
  return (
    <ApiKeysProvider>
      <ApiKeysCardInner />
    </ApiKeysProvider>
  );
}

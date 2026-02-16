'use client';
import { useState } from 'react';
import { Copy, Check, Plus, Trash2, Key, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth, useApiKeys, useCreateApiKey, useRevokeApiKey } from '@/hooks';

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: apiKeys, isLoading: isLoadingKeys } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();

  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyShown, setNewKeyShown] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateKey = async () => {
    try {
      const result = await createApiKey.mutateAsync({
        name: newKeyName || 'Default',
      });
      setNewKeyShown(result.key);
      toast.success('API key created');
    } catch {
      toast.error('Failed to create API key');
    }
  };

  const handleCopyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      await revokeApiKey.mutateAsync(keyId);
      toast.success('API key revoked');
    } catch {
      toast.error('Failed to revoke API key');
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewKeyName('');
    setNewKeyShown(null);
    setCopied(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and API keys
        </p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={user?.name || ''} disabled />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Plan</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {user?.tier || 'Free'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <Badge variant={user?.is_active ? 'default' : 'destructive'}>
                  {user?.is_active ? 'Active' : 'Inactive'}
                </Badge>
                {user?.is_verified && <Badge variant="outline">Verified</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for programmatic access
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {newKeyShown ? 'API Key Created' : 'Create API Key'}
                  </DialogTitle>
                  <DialogDescription>
                    {newKeyShown
                      ? "Copy your API key now. You won't be able to see it again."
                      : 'Create a new API key for programmatic access.'}
                  </DialogDescription>
                </DialogHeader>

                {newKeyShown ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={newKeyShown}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyKey(newKeyShown)}
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-destructive text-sm">
                      Make sure to copy your API key now. You won&apos;t be able
                      to see it again!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName">Key Name</Label>
                      <Input
                        id="keyName"
                        placeholder="e.g., Production Key"
                        value={newKeyName}
                        onChange={e => setNewKeyName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <DialogFooter>
                  {newKeyShown ? (
                    <Button onClick={handleDialogClose}>Done</Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleDialogClose}>
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
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingKeys ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : apiKeys && apiKeys.length > 0 ? (
            <div className="space-y-4">
              {apiKeys.map(key => (
                <div
                  key={key.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                      <Key className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{key.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {key.prefix}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={key.is_active ? 'default' : 'secondary'}>
                      {key.is_active ? 'Active' : 'Revoked'}
                    </Badge>
                    {key.is_active && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRevokeKey(key.id)}
                        disabled={revokeApiKey.isPending}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
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
    </div>
  );
}

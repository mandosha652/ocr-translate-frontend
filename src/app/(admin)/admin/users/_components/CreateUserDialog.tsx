'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminCreateUser } from '@/hooks';

export function CreateUserDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { mutate: createUser, isPending } = useAdminCreateUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const reset = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(
      {
        email,
        password,
        name: name || undefined,
        user_type: 'team',
        tier: 'free',
        is_verified: true,
      },
      {
        onSuccess: () => {
          toast.success('Team user created');
          reset();
          onOpenChange(false);
        },
        onError: () => toast.error('Failed to create team user'),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Team User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div className="space-y-1">
            <Label htmlFor="cu-email">Email</Label>
            <Input
              id="cu-email"
              type="email"
              required
              autoComplete="off"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cu-password">Password</Label>
            <Input
              id="cu-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cu-name">Name (optional)</Label>
            <Input
              id="cu-name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Creating…' : 'Create Team User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

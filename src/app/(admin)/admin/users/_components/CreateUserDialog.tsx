'use client';

import { KeyRound, Mail, User, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminCreateUser } from '@/hooks';
import { TIER_STYLES } from '@/lib/constants';
import type { AdminCreateUser } from '@/types/admin';

type Tier = NonNullable<AdminCreateUser['tier']>;

const USER_TYPES = [
  {
    value: 'customer' as const,
    label: 'Customer',
    description: 'Regular user with tier-based limits',
    icon: User,
  },
  {
    value: 'team' as const,
    label: 'Team (VA)',
    description: 'Internal account with dedicated limits',
    icon: Users,
  },
];

const TIERS: { value: Tier; label: string; description: string }[] = [
  { value: 'free', label: 'Free', description: '20 images/mo' },
  { value: 'pro', label: 'Pro', description: '500 images/mo' },
  { value: 'business', label: 'Business', description: '2,000 images/mo' },
  { value: 'enterprise', label: 'Enterprise', description: 'Unlimited' },
];

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
  const [userType, setUserType] = useState<'customer' | 'team'>('team');
  const [tier, setTier] = useState<Tier>('free');

  const reset = () => {
    setEmail('');
    setPassword('');
    setName('');
    setUserType('team');
    setTier('free');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(
      {
        email,
        password,
        name: name || undefined,
        user_type: userType,
        tier,
        is_verified: true,
      },
      {
        onSuccess: () => {
          toast.success('User created');
          reset();
          onOpenChange(false);
        },
        onError: () => toast.error('Failed to create user'),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden p-0">
        {/* Header with accent background */}
        <div className="from-primary/5 via-primary/3 bg-linear-to-b to-transparent px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <UserPlus className="text-primary h-4 w-4" />
              </div>
              Create User
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/80 mt-1">
              Add a new customer or team account to the platform.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          {/* Account details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-muted h-px flex-1" />
              <span className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
                Account
              </span>
              <div className="bg-muted h-px flex-1" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cu-email" className="text-xs font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="text-muted-foreground/50 pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
                  <Input
                    id="cu-email"
                    type="email"
                    placeholder="user@example.com"
                    required
                    autoComplete="off"
                    className="pl-9"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cu-password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <KeyRound className="text-muted-foreground/50 pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
                  <Input
                    id="cu-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="pl-9"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cu-name" className="text-xs font-medium">
                Name{' '}
                <span className="text-muted-foreground/60 font-normal">
                  (optional)
                </span>
              </Label>
              <div className="relative">
                <User className="text-muted-foreground/50 pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
                <Input
                  id="cu-name"
                  placeholder="John Doe"
                  className="pl-9"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* User type selector */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-muted h-px flex-1" />
              <span className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
                User Type
              </span>
              <div className="bg-muted h-px flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {USER_TYPES.map(t => {
                const Icon = t.icon;
                const selected = userType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setUserType(t.value)}
                    className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 text-center transition-all duration-200 ${
                      selected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-muted hover:border-primary/30 hover:bg-muted/50'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                        selected
                          ? 'bg-primary/15 text-primary'
                          : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary/70'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}
                      >
                        {t.label}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-[11px] leading-tight">
                        {t.description}
                      </p>
                    </div>
                    {selected ? (
                      <div className="bg-primary absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-950" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier selector — only for customers */}
          {userType === 'customer' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-muted h-px flex-1" />
                <span className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
                  Plan Tier
                </span>
                <div className="bg-muted h-px flex-1" />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {TIERS.map(t => {
                  const selected = tier === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTier(t.value)}
                      className={`relative flex flex-col items-center gap-1.5 rounded-lg border-2 px-2 py-3 transition-all duration-200 ${
                        selected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-muted hover:border-primary/30 hover:bg-muted/50'
                      }`}
                    >
                      <Badge
                        variant="outline"
                        className={`px-1.5 py-0 text-[10px] ${TIER_STYLES[t.value] || ''}`}
                      >
                        {t.label}
                      </Badge>
                      <span className="text-muted-foreground text-[10px] leading-tight">
                        {t.description}
                      </span>
                      {selected ? (
                        <div className="bg-primary absolute -top-1 -right-1 h-2 w-2 rounded-full ring-2 ring-white dark:ring-gray-950" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter className="border-muted gap-2 border-t pt-4 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-none"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {isPending ? 'Creating…' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

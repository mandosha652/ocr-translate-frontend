'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile } from '@/hooks';
import type { User } from '@/types';

interface EditProfileFormProps {
  user: User | null | undefined;
  onSaveComplete: () => void;
  onCancel: () => void;
}

function getProfileUpdates(
  profileName: string,
  profileEmail: string,
  currentUser: User | null | undefined
): { name?: string; email?: string } {
  const updates: { name?: string; email?: string } = {};
  if (profileName.trim() !== (currentUser?.name ?? ''))
    updates.name = profileName.trim();
  if (profileEmail.trim() !== currentUser?.email)
    updates.email = profileEmail.trim();
  return updates;
}

export function EditProfileForm({
  user,
  onSaveComplete,
  onCancel,
}: EditProfileFormProps) {
  const [profileName, setProfileName] = useState(user?.name ?? '');
  const [profileEmail, setProfileEmail] = useState(user?.email ?? '');
  const updateProfile = useUpdateProfile();

  const handleSave = async () => {
    const updates = getProfileUpdates(profileName, profileEmail, user);
    if (Object.keys(updates).length === 0) {
      onSaveComplete();
      return;
    }
    try {
      await updateProfile.mutateAsync(updates);
      toast.success('Changes saved');
      onSaveComplete();
    } catch {
      toast.error("Couldn't save your changes — please try again");
    }
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profileEmail">Email</Label>
          <Input
            id="profileEmail"
            value={profileEmail}
            disabled={updateProfile.isPending}
            onChange={e => setProfileEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profileName">Name</Label>
          <Input
            id="profileName"
            value={profileName}
            disabled={updateProfile.isPending}
            onChange={e => setProfileName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending && (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          )}
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={updateProfile.isPending}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}

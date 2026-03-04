'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminUpdateUser } from '@/hooks';

interface TierUpdateDialogProps {
  userId: string;
  currentTier: 'free' | 'pro' | 'enterprise';
}

export function TierUpdateDialog({
  userId,
  currentTier,
}: TierUpdateDialogProps) {
  const [selectedTier, setSelectedTier] = useState(currentTier);
  const updateUser = useAdminUpdateUser();

  const handleSaveTier = () => {
    updateUser.mutate(
      { userId, data: { tier: selectedTier } },
      { onSuccess: () => toast.success('Tier updated') }
    );
  };

  return (
    <div className="space-y-3">
      <Select
        value={selectedTier}
        onValueChange={value =>
          setSelectedTier(value as 'free' | 'pro' | 'enterprise')
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={handleSaveTier}
        disabled={updateUser.isPending || selectedTier === currentTier}
        className="w-full"
      >
        {updateUser.isPending ? 'Updating...' : 'Update Tier'}
      </Button>
    </div>
  );
}

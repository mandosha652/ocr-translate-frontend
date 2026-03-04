'use client';

import { AlertTriangle, Upload } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

export function IdleState() {
  return (
    <EmptyState
      icon={Upload}
      title="Upload Image"
      description="Your translated image will appear here"
    />
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="bg-primary/10 rounded-full p-3">
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
        <p className="text-muted-foreground">Processing your image...</p>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="flex items-center gap-3 py-6">
        <AlertTriangle className="text-destructive h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-destructive font-medium">Translation failed</p>
          <p className="text-destructive/80 text-sm">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

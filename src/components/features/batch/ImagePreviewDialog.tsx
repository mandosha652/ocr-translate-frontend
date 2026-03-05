'use client';

import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImagePreviewDialogProps {
  previewImage: { file: File; preview: string } | null;
  onClose: () => void;
}

export function ImagePreviewDialog({
  previewImage,
  onClose,
}: ImagePreviewDialogProps) {
  return (
    <Dialog open={!!previewImage} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="space-y-2">
          <DialogTitle>{previewImage?.file.name}</DialogTitle>
          <p className="text-muted-foreground text-sm">
            {previewImage
              ? `${(previewImage.file.size / 1024 / 1024).toFixed(2)} MB`
              : null}
          </p>
        </DialogHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          {previewImage ? (
            <Image
              src={previewImage.preview}
              alt={previewImage.file.name}
              fill
              className="object-contain"
              unoptimized
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

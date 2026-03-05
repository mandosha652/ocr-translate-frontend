'use client';

import { Camera, Image as ImageIcon, Upload } from 'lucide-react';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import {
  MAX_BATCH_SIZE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '@/lib/constants';
import { cn } from '@/lib/utils';

interface DropzoneAreaProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  isDragActive: boolean;
  disabled?: boolean;
  atCapacity: boolean;
  onDrop: (files: File[]) => void;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  maxBatchSize?: number;
}

export function DropzoneArea({
  getRootProps,
  getInputProps,
  isDragActive,
  disabled,
  atCapacity,
  onDrop,
  cameraInputRef,
  maxBatchSize = MAX_BATCH_SIZE,
}: DropzoneAreaProps) {
  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          'rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30',
          disabled || atCapacity
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200',
              isDragActive ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            {isDragActive ? (
              <ImageIcon className="text-primary animate-in zoom-in-75 h-5 w-5 duration-150" />
            ) : (
              <Upload className="text-muted-foreground h-5 w-5" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {isDragActive
                ? 'Drop images here'
                : 'Drag & drop images, or click to browse'}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Up to {maxBatchSize} images, max {MAX_FILE_SIZE_MB}MB each
            </p>
          </div>
          <p className="text-muted-foreground text-xs">
            Supported: JPEG, PNG, WebP
          </p>
        </div>
      </div>

      {/* Camera capture — shown only on touch devices via CSS */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file && file.size <= MAX_FILE_SIZE_BYTES) onDrop([file]);
          e.target.value = '';
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="flex w-full items-center gap-2 sm:hidden"
        disabled={disabled || atCapacity}
        onClick={() => cameraInputRef.current?.click()}
      >
        <Camera className="h-4 w-4" />
        Take a Photo
      </Button>
    </>
  );
}

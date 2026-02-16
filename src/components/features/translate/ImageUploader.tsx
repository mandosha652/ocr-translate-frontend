'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '@/lib/constants';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export function ImageUploader({
  onFileSelect,
  selectedFile,
  disabled,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
    disabled,
  });

  const clearFile = () => {
    onFileSelect(null);
    setPreview(null);
  };

  if (selectedFile && preview) {
    return (
      <div className="bg-muted/50 relative rounded-lg border p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={clearFile}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-muted-foreground text-sm">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
          {isDragActive ? (
            <ImageIcon className="text-primary h-6 w-6" />
          ) : (
            <Upload className="text-muted-foreground h-6 w-6" />
          )}
        </div>
        <div>
          <p className="font-medium">
            {isDragActive ? 'Drop your image here' : 'Drag & drop an image'}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            or click to browse (max {MAX_FILE_SIZE_MB}MB)
          </p>
        </div>
        <p className="text-muted-foreground text-xs">
          Supported formats: JPEG, PNG, WebP
        </p>
      </div>
    </div>
  );
}

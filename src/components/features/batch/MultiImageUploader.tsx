'use client';

import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { useImagePreviews } from '@/hooks/batch/useImagePreviews';
import { MAX_BATCH_SIZE, MAX_FILE_SIZE_BYTES } from '@/lib/constants';

import { DropzoneArea } from './DropzoneArea';
import { FileRejectionList } from './FileRejectionList';
import { ImagePreviewDialog } from './ImagePreviewDialog';
import { ImagePreviewGrid } from './ImagePreviewGrid';

interface MultiImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  selectedFiles: File[];
  disabled?: boolean;
  maxBatchSize?: number;
}

const getFileKey = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}`;

export function MultiImageUploader({
  onFilesChange,
  selectedFiles,
  disabled,
  maxBatchSize = MAX_BATCH_SIZE,
}: MultiImageUploaderProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);

  const { previews, clearPreviews } = useImagePreviews(selectedFiles);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = maxBatchSize - selectedFiles.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      onFilesChange([...selectedFiles, ...filesToAdd]);
    },
    [selectedFiles, onFilesChange, maxBatchSize]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
      },
      maxSize: MAX_FILE_SIZE_BYTES,
      multiple: true,
      disabled: disabled || selectedFiles.length >= maxBatchSize,
    });

  const atCapacity = selectedFiles.length >= maxBatchSize;
  const totalSizeMB = (
    selectedFiles.reduce((acc, f) => acc + f.size, 0) /
    1024 /
    1024
  ).toFixed(2);

  return (
    <div className="space-y-4">
      <DropzoneArea
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        disabled={disabled}
        atCapacity={atCapacity}
        onDrop={onDrop}
        cameraInputRef={cameraInputRef}
        maxBatchSize={maxBatchSize}
      />

      <FileRejectionList rejections={fileRejections} />

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {selectedFiles.length} of {maxBatchSize} images ({totalSizeMB} MB
              total)
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onFilesChange([]);
                clearPreviews();
              }}
              disabled={disabled}
            >
              Clear all
            </Button>
          </div>

          <ImagePreviewGrid
            files={selectedFiles}
            previews={previews}
            disabled={disabled}
            onRemove={i =>
              onFilesChange(selectedFiles.filter((_, idx) => idx !== i))
            }
            onPreview={(file, preview) => setPreviewImage({ file, preview })}
            getFileKey={getFileKey}
          />
        </div>
      )}

      <ImagePreviewDialog
        previewImage={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}

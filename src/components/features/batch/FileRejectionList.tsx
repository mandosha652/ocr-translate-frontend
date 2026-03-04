'use client';

import { AlertCircle } from 'lucide-react';
import type { FileRejection } from 'react-dropzone';

import { MAX_FILE_SIZE_MB } from '@/lib/constants';

interface FileRejectionListProps {
  rejections: readonly FileRejection[];
}

export function FileRejectionList({ rejections }: FileRejectionListProps) {
  if (rejections.length === 0) return null;

  return (
    <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
      <div className="mb-1.5 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span className="font-medium">
          {rejections.length} file
          {rejections.length !== 1 ? 's' : ''} rejected
        </span>
      </div>
      <ul className="ml-6 space-y-0.5">
        {rejections.slice(0, 3).map(({ file, errors }) => (
          <li key={file.name} className="text-xs">
            <span className="font-medium">{file.name}</span>
            {' — '}
            {errors[0]?.code === 'file-too-large'
              ? `too large (max ${MAX_FILE_SIZE_MB}MB)`
              : errors[0]?.code === 'file-invalid-type'
                ? 'unsupported format (JPEG, PNG, WebP only)'
                : (errors[0]?.message ?? 'rejected')}
          </li>
        ))}
        {rejections.length > 3 && (
          <li className="text-xs opacity-70">+{rejections.length - 3} more</li>
        )}
      </ul>
    </div>
  );
}

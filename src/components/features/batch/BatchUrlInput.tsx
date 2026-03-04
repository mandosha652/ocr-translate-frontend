'use client';

import { Link, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUrlInput } from '@/hooks/batch/useUrlInput';
import { MAX_BATCH_SIZE } from '@/lib/constants';
import { isValidHttpUrl } from '@/lib/utils';

interface BatchUrlInputProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function BatchUrlInput({
  urls,
  onChange,
  disabled,
}: BatchUrlInputProps) {
  const { handleChange, handleAdd, handleRemove, validCount, canAddMore } =
    useUrlInput(urls, onChange);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {urls.map((url, i) => (
          <div key={i} className="space-y-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={e => handleChange(i, e.target.value)}
                  disabled={disabled}
                  className="pl-9"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(i)}
                disabled={disabled}
                className="shrink-0"
                aria-label="Remove URL"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {url.trim() && !isValidHttpUrl(url.trim()) && (
              <p className="pl-1 text-xs text-amber-600">
                Enter a valid URL starting with http:// or https://
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={disabled || !canAddMore}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add URL
        </Button>
        <p className="text-muted-foreground text-xs">
          {validCount > 0 ? (
            <>
              <span className="text-foreground font-medium">{validCount}</span>{' '}
              valid URL
              {validCount !== 1 ? 's' : ''}
            </>
          ) : (
            `0 of ${MAX_BATCH_SIZE} max`
          )}
        </p>
      </div>
    </div>
  );
}

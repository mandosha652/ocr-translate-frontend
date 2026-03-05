'use client';

import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';

interface HistorySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function HistorySearch({ value, onChange }: HistorySearchProps) {
  return (
    <div className="relative w-full sm:w-56">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
      <Input
        placeholder="Search by language…"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-9 pr-8 pl-8 text-sm"
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          title="Clear"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

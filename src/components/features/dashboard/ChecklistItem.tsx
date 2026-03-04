'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface ChecklistItemProps {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  cta: string;
  completed: boolean;
  onDocsClick?: () => void;
}

export function ChecklistItem({
  id,
  label,
  description,
  href,
  icon: Icon,
  cta,
  completed,
  onDocsClick,
}: ChecklistItemProps) {
  return (
    <li className="flex items-start gap-3">
      {completed ? (
        <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
      ) : (
        <Circle className="text-muted-foreground/40 mt-0.5 h-5 w-5 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-snug font-medium ${completed ? 'text-muted-foreground line-through' : ''}`}
        >
          {label}
        </p>
        {!completed && (
          <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
        )}
      </div>
      {!completed && (
        <Link href={href} onClick={id === 'docs' ? onDocsClick : undefined}>
          <Button size="xs" variant="outline" className="shrink-0 gap-1.5">
            <Icon className="h-3 w-3" />
            {cta}
          </Button>
        </Link>
      )}
    </li>
  );
}

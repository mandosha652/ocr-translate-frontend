'use client';

import { ArrowRight, ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';

interface WelcomeSlideProps {
  slide: number;
  userName?: string | null;
  icon: React.ElementType;
  badge?: string;
  title: string;
  description: string;
  cta?: string;
  href?: string;
  isLast: boolean;
  onNext: () => void;
  onCta: (href: string) => void;
  onSkip: () => void;
}

export function WelcomeSlide({
  slide,
  userName,
  icon: Icon,
  badge,
  title,
  description,
  cta,
  href,
  isLast,
  onNext,
  onCta,
  onSkip,
}: WelcomeSlideProps) {
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Icon className="text-primary h-6 w-6" />
        </div>
        {badge ? <Badge variant="secondary">{badge}</Badge> : null}
      </div>
      <DialogTitle className="text-xl">
        {slide === 0 ? `Welcome${userName ? `, ${userName}` : ''}!` : title}
      </DialogTitle>
      <DialogDescription className="text-base leading-relaxed">
        {description}
      </DialogDescription>

      <div className="flex items-center justify-between gap-2 pt-6">
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Skip tour
        </Button>
        <div className="flex gap-2">
          {href ? (
            <Button variant="outline" size="sm" onClick={() => onCta(href)}>
              {cta}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          ) : null}
          <Button size="sm" onClick={onNext}>
            {isLast ? 'Get started' : 'Next'}
            {!isLast && <ChevronRight className="ml-1 h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
    </>
  );
}

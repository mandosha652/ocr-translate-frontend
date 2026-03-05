'use client';

import { ImageIcon, Key, Layers, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import type { User } from '@/types';

import { WelcomeSlide } from './WelcomeSlide';

const WELCOME_MODAL_KEY = 'welcome_modal_shown';

interface Slide {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  cta?: string;
  href?: string;
}

const SLIDES: Slide[] = [
  {
    icon: Zap,
    title: 'Welcome to ImgText',
    description:
      'Translate text in images instantly. Upload a photo, pick a language, and get a translated version in seconds.',
    badge: 'Get started',
  },
  {
    icon: ImageIcon,
    title: 'Single image translation',
    description:
      'Go to Translate, upload a JPEG, PNG, or WebP file, choose your target language, and hit Translate. Results appear side-by-side with the original.',
    cta: 'Try it now',
    href: '/translate',
  },
  {
    icon: Layers,
    title: 'Batch translation',
    description:
      'Need to translate dozens of images at once? Use Batch to upload up to 20 images and process them across multiple languages simultaneously.',
    cta: 'Open batch',
    href: '/batch',
  },
  {
    icon: Key,
    title: 'API access',
    description:
      'Integrate ImgText directly into your workflows. Create an API key in Settings and use the REST API to translate images programmatically.',
    cta: 'Create an API key',
    href: '/settings#api-keys',
  },
];

interface Props {
  user: User;
}

export function WelcomeModal({ user }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem(WELCOME_MODAL_KEY);
  });
  const [slide, setSlide] = useState(0);

  function dismiss() {
    localStorage.setItem(WELCOME_MODAL_KEY, 'true');
    setOpen(false);
  }

  function next() {
    if (slide < SLIDES.length - 1) {
      setSlide(s => s + 1);
    } else {
      dismiss();
    }
  }

  function handleCta(href: string) {
    dismiss();
    router.push(href);
  }

  const current = SLIDES[slide];
  const Icon = current.icon;
  const isLast = slide === SLIDES.length - 1;

  return (
    <Dialog open={open} onOpenChange={open => !open && dismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <WelcomeSlide
            slide={slide}
            userName={user.name}
            icon={Icon}
            badge={current.badge}
            title={current.title}
            description={current.description}
            cta={current.cta}
            href={current.href}
            isLast={isLast}
            onNext={next}
            onCta={handleCta}
            onSkip={dismiss}
          />
        </DialogHeader>

        <div className="flex items-center justify-center gap-1.5 py-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === slide ? 'bg-primary w-4' : 'bg-muted-foreground/30 w-1.5'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

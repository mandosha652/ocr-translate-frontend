'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const GRADIENT =
  'linear-gradient(135deg, oklch(0.45 0.22 260), oklch(0.55 0.2 300))';

export function HomeNavActions() {
  const isDevBypass = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const authed = isAuthenticated || isDevBypass;

  return (
    <nav className="flex items-center gap-1.5 sm:gap-3">
      <Link href={authed ? '/dashboard' : '/login'}>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground px-3 text-[13px] font-medium hover:bg-transparent"
        >
          {authed ? 'Dashboard' : 'Sign in'}
        </Button>
      </Link>
      <Link href={authed ? '/translate' : '/signup'}>
        <Button
          size="sm"
          className="rounded-full px-4 text-[13px] font-semibold shadow-none"
          style={{ background: GRADIENT, color: 'white' }}
        >
          {authed ? 'Start Translating' : 'Get Started'}
        </Button>
      </Link>
    </nav>
  );
}

export function HeroCTAActions() {
  const isDevBypass = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const authed = isAuthenticated || isDevBypass;

  return (
    <div className="flex flex-col items-center gap-3.5 sm:flex-row">
      <Link href={authed ? '/translate' : '/signup'}>
        <Button
          size="lg"
          className="h-12 gap-2 rounded-full px-7 text-[15px] font-semibold shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_32px_rgba(0,0,0,0.2)]"
          style={{ background: GRADIENT, color: 'white' }}
        >
          {authed ? 'Start Translating' : "Get Started — it's free"}{' '}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={authed ? '/dashboard' : '/login'}>
        <Button
          size="lg"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground h-12 rounded-full px-6 text-[15px] font-medium hover:bg-transparent"
        >
          {authed ? 'Dashboard' : 'Sign in'}
        </Button>
      </Link>
    </div>
  );
}

export function BottomCTAAction() {
  const isDevBypass = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const authed = isAuthenticated || isDevBypass;

  return (
    <Link href={authed ? '/translate' : '/signup'}>
      <Button
        size="lg"
        className="h-[52px] gap-2 rounded-full px-8 text-[16px] font-semibold shadow-[0_4px_32px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)]"
        style={{ background: GRADIENT, color: 'white' }}
      >
        {authed ? 'Start Translating' : "Get Started — it's free"}{' '}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  );
}

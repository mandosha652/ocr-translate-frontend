import { notFound } from 'next/navigation';

import { TEAM_SLUG } from '@/lib/constants';

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  // Server-side slug gate: block the entire /ops tree if the slug env var is not set.
  // Individual pages also verify the slug param matches TEAM_SLUG.
  if (!TEAM_SLUG) {
    notFound();
  }

  return <>{children}</>;
}

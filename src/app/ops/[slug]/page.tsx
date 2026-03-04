import { notFound, redirect } from 'next/navigation';

import { TEAM_SLUG } from '@/lib/constants';

export default async function OpsIndexPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== TEAM_SLUG) {
    notFound();
  }
  redirect(`/ops/${slug}/login`);
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Studies — ImgText',
  description:
    'See how leading companies use ImgText to scale image translation.',
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

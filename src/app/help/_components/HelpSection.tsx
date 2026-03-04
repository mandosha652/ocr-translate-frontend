import { FaqAccordion } from '@/components/features/help/FaqAccordion';

interface Faq {
  q: string;
  a: string;
}

interface HelpSectionProps {
  faqs: Faq[];
}

export function HelpSection({ faqs }: HelpSectionProps) {
  return (
    <section className="mb-12 space-y-4">
      <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
      <FaqAccordion faqs={faqs} />
    </section>
  );
}

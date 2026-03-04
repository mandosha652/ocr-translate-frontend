import { Check, Minus } from 'lucide-react';

export function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="text-primary mx-auto h-4 w-4" />;
  if (value === false)
    return <Minus className="text-muted-foreground/40 mx-auto h-4 w-4" />;
  return <span className="text-sm font-medium">{value}</span>;
}

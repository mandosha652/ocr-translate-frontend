import { Check, X } from 'lucide-react';

export function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <Check className="h-5 w-5 font-bold text-green-500" />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <X className="text-muted-foreground/30 h-5 w-5" />
      </div>
    );
  }
  return <span className="text-foreground text-sm font-medium">{value}</span>;
}

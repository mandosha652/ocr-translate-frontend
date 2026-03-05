interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
}

export function InfoRow({ label, value, icon: Icon }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b py-2 text-sm last:border-0">
      <div className="text-muted-foreground flex w-24 shrink-0 items-center gap-1.5 sm:w-32">
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </div>
      <div className="min-w-0 flex-1 text-right">{value}</div>
    </div>
  );
}

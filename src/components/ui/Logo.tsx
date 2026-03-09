import Link from 'next/link';

interface LogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
};

export function Logo({ href, size = 'md', className = '' }: LogoProps) {
  const text = (
    <span
      className={`font-semibold tracking-tight select-none ${sizeClasses[size]} ${className}`}
    >
      <span className="bg-linear-to-br from-blue-500 to-violet-600 bg-clip-text text-transparent">
        img
      </span>
      <span className="text-foreground">text</span>
    </span>
  );

  if (!href) return text;

  return (
    <Link
      href={href}
      className="focus-visible:ring-ring/50 inline-flex items-center rounded-sm transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:outline-none"
    >
      {text}
    </Link>
  );
}

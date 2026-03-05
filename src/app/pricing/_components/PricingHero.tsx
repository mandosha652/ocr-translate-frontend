export function PricingHero() {
  return (
    <div className="mb-20 text-center md:mb-24">
      <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight sm:text-6xl lg:text-7xl">
        Simple,{' '}
        <span className="from-primary bg-linear-to-r via-purple-500 to-pink-500 bg-clip-text text-transparent">
          transparent pricing
        </span>
      </h1>
      <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
        Start free. Scale as you grow. No hidden fees, no surprises.
      </p>
    </div>
  );
}

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-extrabold text-ink sm:text-4xl">
          Beyond the plate
        </h1>
        <p className="mt-4 text-muted">
          Healthy Recipe Finder started with a simple belief: eating well shouldn't be
          complicated, expensive, or time-consuming.
        </p>
      </header>

      <section className="mt-12 grid items-center gap-10 lg:grid-cols-2">
        <picture>
          <source media="(min-width: 640px)" srcSet="/assets/images/image-about-beyond-the-plate-large.webp" />
          <img
            src="/assets/images/image-about-beyond-the-plate-small.webp"
            alt="Fresh ingredients on a kitchen counter"
            className="w-full rounded-3xl object-cover"
          />
        </picture>
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl font-bold text-ink">What we believe</h2>
          <p className="text-muted">
            Good food is built on whole ingredients and a few thoughtful steps. We curate
            recipes that respect your time while never cutting corners on flavour or
            nutrition.
          </p>
        </div>
      </section>

      <section className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <div className="order-2 flex flex-col gap-4 lg:order-1">
          <h2 className="font-heading text-2xl font-bold text-ink">Our mission</h2>
          <p className="text-muted">
            We want to make healthy cooking approachable for everyone — whether you're a
            seasoned home cook or just starting out. Every recipe is tested to be
            forgiving, flexible, and genuinely delicious.
          </p>
        </div>
        <picture className="order-1 lg:order-2">
          <source media="(min-width: 640px)" srcSet="/assets/images/image-about-our-mission-large.webp" />
          <img
            src="/assets/images/image-about-our-mission-small.webp"
            alt="A finished healthy meal"
            className="w-full rounded-3xl object-cover"
          />
        </picture>
      </section>
    </div>
  );
}

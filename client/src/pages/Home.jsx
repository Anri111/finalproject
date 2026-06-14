import { Link } from "react-router-dom";

const features = [
  {
    icon: "icon-whole-food-recipes.svg",
    title: "Whole-food recipes",
    body: "Every dish is built around real, unprocessed ingredients you can feel good about.",
  },
  {
    icon: "icon-search-in-seconds.svg",
    title: "Search in seconds",
    body: "Filter by prep or cook time and find something that fits your evening in moments.",
  },
  {
    icon: "icon-minimum-fuss.svg",
    title: "Minimum fuss",
    body: "Short ingredient lists and clear steps mean less time cooking, more time enjoying.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col items-start gap-6">
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Healthy food, made simple
          </h1>
          <p className="max-w-md text-lg text-muted">
            Discover eight quick, whole-food recipes that fit real-life schedules and taste
            amazing. No fuss, no fancy equipment — just good food.
          </p>
          <Link
            to="/recipes"
            className="rounded-lg bg-forest px-6 py-3 font-bold text-cream transition-colors hover:bg-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            Browse recipes
          </Link>
        </div>
        <picture>
          <source media="(min-width: 640px)" srcSet="/assets/images/image-home-hero-large.webp" />
          <img
            src="/assets/images/image-home-hero-small.webp"
            alt="A spread of fresh, healthy dishes"
            className="w-full rounded-3xl object-cover"
          />
        </picture>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <ul className="grid gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="flex flex-col items-start gap-3">
              <img src={`/assets/images/${f.icon}`} alt="" className="h-12 w-12" />
              <h2 className="font-heading text-lg font-bold text-ink">{f.title}</h2>
              <p className="text-muted">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Real life */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <picture className="order-2 lg:order-1">
          <source media="(min-width: 640px)" srcSet="/assets/images/image-home-real-life-large.webp" />
          <img
            src="/assets/images/image-home-real-life-small.webp"
            alt="Preparing a meal at home"
            className="w-full rounded-3xl object-cover"
          />
        </picture>
        <div className="order-1 flex flex-col items-start gap-5 lg:order-2">
          <h2 className="font-heading text-3xl font-extrabold text-ink">
            Cooking that fits real life
          </h2>
          <p className="max-w-md text-muted">
            Weeknights are busy. These recipes are designed to come together fast, using
            ingredients you already keep on hand — so eating well never feels like a chore.
          </p>
          <Link
            to="/about"
            className="font-semibold text-forest underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            Learn more about us
          </Link>
        </div>
      </section>
    </>
  );
}

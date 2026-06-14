import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-heading text-5xl font-extrabold text-ink">404</h1>
      <p className="mt-3 text-muted">We couldn't find that page.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-forest px-5 py-3 font-bold text-cream transition-colors hover:bg-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      >
        Back home
      </Link>
    </section>
  );
}

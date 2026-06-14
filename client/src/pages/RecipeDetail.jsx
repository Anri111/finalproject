import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import RecipeMeta from "../components/RecipeMeta";
import RecipeCard from "../components/RecipeCard";
import StarRating from "../components/StarRating";

function BulletList({ items, ordered }) {
  return (
    <ul className="space-y-2">
      {items.map((text, i) => (
        <li key={i} className="flex gap-3 text-muted">
          <img
            src="/assets/images/icon-bullet-point.svg"
            alt=""
            className="mt-2 h-2 w-2 shrink-0"
          />
          <span>
            {ordered && <span className="sr-only">Step {i + 1}: </span>}
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function RecipeDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0 });
    api
      .getRecipe(slug)
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="py-16 text-center text-muted">Loading…</p>;
  if (error)
    return (
      <div className="py-16 text-center">
        <p className="text-orange">Recipe not found.</p>
        <Link to="/recipes" className="mt-3 inline-block font-semibold text-forest underline">
          Back to recipes
        </Link>
      </div>
    );

  const { recipe, more, myRating } = data;

  return (
    <article className="mx-auto max-w-6xl px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
        <Link to="/recipes" className="hover:text-orange focus-visible:text-orange focus-visible:outline-none">
          Recipes
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{recipe.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <img
          src={recipe.image.large}
          alt={recipe.title}
          className="aspect-[4/3] w-full rounded-2xl object-cover"
        />

        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-3xl font-extrabold text-ink sm:text-4xl">
            {recipe.title}
          </h1>
          <p className="text-muted">{recipe.overview}</p>
          <RecipeMeta
            servings={recipe.servings}
            prepMinutes={recipe.prepMinutes}
            cookMinutes={recipe.cookMinutes}
          />
          <StarRating
            recipeId={recipe._id}
            avgRating={recipe.avgRating}
            ratingCount={recipe.ratingCount}
            myRating={myRating}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-heading text-xl font-bold text-ink">Ingredients</h2>
          <BulletList items={recipe.ingredients} />
        </section>
        <section>
          <h2 className="mb-4 font-heading text-xl font-bold text-ink">Instructions</h2>
          <BulletList items={recipe.instructions} ordered />
        </section>
      </div>

      {/* More recipes */}
      {more?.length > 0 && (
        <section className="mt-16 border-t border-black/10 pt-10">
          <h2 className="mb-6 font-heading text-2xl font-bold text-ink">More recipes</h2>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((r) => (
              <li key={r._id}>
                <RecipeCard recipe={r} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

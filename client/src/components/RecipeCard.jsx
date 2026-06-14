import { Link } from "react-router-dom";
import RecipeMeta from "./RecipeMeta";
import FavoriteButton from "./FavoriteButton";

export default function RecipeCard({ recipe }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative">
        <img
          src={recipe.image.large}
          alt={recipe.title}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
        <FavoriteButton recipeId={recipe._id} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-heading text-lg font-bold text-ink">{recipe.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{recipe.overview}</p>

        <RecipeMeta
          servings={recipe.servings}
          prepMinutes={recipe.prepMinutes}
          cookMinutes={recipe.cookMinutes}
          className="mt-1"
        />

        <Link
          to={`/recipes/${recipe.slug}`}
          className="mt-auto rounded-lg bg-forest px-5 py-3 text-center text-sm font-bold text-cream transition-colors hover:bg-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          View Recipe
        </Link>
      </div>
    </article>
  );
}

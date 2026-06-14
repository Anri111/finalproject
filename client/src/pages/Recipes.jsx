import { useEffect, useState } from "react";
import { api } from "../lib/api";
import RecipeCard from "../components/RecipeCard";
import FilterDropdown from "../components/FilterDropdown";
import SearchBar from "../components/SearchBar";

const PREP_OPTIONS = [0, 5, 10];
const COOK_OPTIONS = [0, 5, 10, 15, 20];

export default function Recipes() {
  const [q, setQ] = useState("");
  const [maxPrep, setMaxPrep] = useState("");
  const [maxCook, setMaxCook] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      setLoading(true);
      api
        .listRecipes({ q, maxPrep, maxCook })
        .then((data) => {
          setRecipes(data);
          setError(null);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(id);
  }, [q, maxPrep, maxCook]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-extrabold text-ink sm:text-4xl">
          Explore our simple, healthy recipes
        </h1>
        <p className="mt-4 text-muted">
          Discover eight quick, whole-food dishes that fit real-life schedules and taste
          amazing. Use the search bar to find a recipe by name or ingredient, or simply
          scroll the list and let something delicious catch your eye.
        </p>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <FilterDropdown
            label="Max Prep Time"
            options={PREP_OPTIONS}
            value={maxPrep}
            onChange={setMaxPrep}
          />
          <FilterDropdown
            label="Max Cook Time"
            options={COOK_OPTIONS}
            value={maxCook}
            onChange={setMaxCook}
          />
        </div>
        <SearchBar value={q} onChange={setQ} />
      </div>

      {/* Results */}
      <div className="mt-8">
        {error && <p className="text-center text-orange">Couldn't load recipes: {error}</p>}
        {!error && loading && <p className="text-center text-muted">Loading recipes…</p>}
        {!error && !loading && recipes.length === 0 && (
          <p className="text-center text-muted">No recipes match your filters.</p>
        )}
        {!error && !loading && recipes.length > 0 && (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <li key={r._id}>
                <RecipeCard recipe={r} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

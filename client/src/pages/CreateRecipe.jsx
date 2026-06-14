import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const inputClass =
  "w-full rounded-lg bg-white px-4 py-2.5 ring-1 ring-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

// Editor for a dynamic list of single-line strings (ingredients / instructions).
function ListEditor({ label, items, setItems, placeholder }) {
  const update = (i, val) => setItems(items.map((it, idx) => (idx === i ? val : it)));
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-semibold text-ink">{label}</legend>
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={it}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            aria-label={`${label} ${i + 1}`}
            className={inputClass}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove ${label} ${i + 1}`}
              className="shrink-0 rounded-lg px-3 text-muted ring-1 ring-black/10 hover:bg-white hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, ""])}
        className="self-start text-sm font-semibold text-forest underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
      >
        + Add {label.toLowerCase().replace(/s$/, "")}
      </button>
    </fieldset>
  );
}

export default function CreateRecipe() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    overview: "",
    servings: 1,
    prepMinutes: 0,
    cookMinutes: 0,
  });
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // Wait for the auth check, then bounce logged-out users to login.
  if (loading) return <p className="py-16 text-center text-muted">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { recipe } = await api.createRecipe({
        ...form,
        servings: Number(form.servings),
        prepMinutes: Number(form.prepMinutes),
        cookMinutes: Number(form.cookMinutes),
        ingredients,
        instructions,
      });
      navigate(`/recipes/${recipe.slug}`);
    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-heading text-3xl font-extrabold text-ink sm:text-4xl">
        Create a recipe
      </h1>
      <p className="mt-2 text-muted">Share a quick, whole-food dish with the community.</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6" noValidate>
        {error && (
          <p role="alert" className="rounded-lg bg-orange/10 px-4 py-3 text-sm text-orange">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
          Title
          <input value={form.title} onChange={set("title")} required className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
          Image URL
          <input
            type="url"
            value={form.imageUrl}
            onChange={set("imageUrl")}
            placeholder="https://…"
            required
            className={inputClass}
          />
        </label>
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="aspect-[4/3] w-full max-w-sm rounded-xl object-cover ring-1 ring-black/10"
            onError={(e) => (e.currentTarget.style.display = "none")}
            onLoad={(e) => (e.currentTarget.style.display = "block")}
          />
        )}

        <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
          Overview
          <textarea
            value={form.overview}
            onChange={set("overview")}
            rows={2}
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
            Servings
            <input type="number" min={1} value={form.servings} onChange={set("servings")} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
            Prep (min)
            <input type="number" min={0} value={form.prepMinutes} onChange={set("prepMinutes")} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
            Cook (min)
            <input type="number" min={0} value={form.cookMinutes} onChange={set("cookMinutes")} className={inputClass} />
          </label>
        </div>

        <ListEditor
          label="Ingredients"
          items={ingredients}
          setItems={setIngredients}
          placeholder="1 cup cherry tomatoes, halved"
        />
        <ListEditor
          label="Instructions"
          items={instructions}
          setItems={setInstructions}
          placeholder="Combine everything in a large bowl."
        />

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-forest px-6 py-3 font-bold text-cream transition-colors hover:bg-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:opacity-60"
        >
          {busy ? "Publishing…" : "Publish recipe"}
        </button>
      </form>
    </section>
  );
}

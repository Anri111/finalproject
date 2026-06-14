import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

function Star({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 ${filled ? "fill-orange" : "fill-black/15"}`} aria-hidden="true">
      <path d="M12 2l2.9 6.26L21.5 9l-5 4.6L18 21l-6-3.6L6 21l1.5-7.4-5-4.6 6.6-.74L12 2z" />
    </svg>
  );
}

// Shows the average, and (for logged-in users) lets them set/change their rating.
export default function StarRating({ recipeId, avgRating, ratingCount, myRating }) {
  const { user } = useAuth();
  const [mine, setMine] = useState(myRating ?? 0);
  const [avg, setAvg] = useState(avgRating);
  const [count, setCount] = useState(ratingCount);
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);

  const submit = async (value) => {
    if (busy) return;
    setBusy(true);
    try {
      const r = await api.rateRecipe(recipeId, value);
      setMine(r.myRating);
      setAvg(r.avgRating);
      setCount(r.ratingCount);
    } catch {
      /* no-op */
    } finally {
      setBusy(false);
    }
  };

  const display = hover || mine;

  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <span className="font-heading text-2xl font-bold text-ink">{avg.toFixed(1)}</span>
        <span className="text-sm text-muted">
          {count} {count === 1 ? "rating" : "ratings"}
        </span>
      </div>

      {user ? (
        <div className="mt-3">
          <p className="mb-1 text-sm text-muted">{mine ? "Your rating" : "Rate this recipe"}</p>
          <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                disabled={busy}
                onMouseEnter={() => setHover(v)}
                onFocus={() => setHover(v)}
                onBlur={() => setHover(0)}
                onClick={() => submit(v)}
                aria-label={`Rate ${v} out of 5`}
                aria-pressed={mine === v}
                className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:opacity-50"
              >
                <Star filled={v <= display} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">
          <Link to="/login" className="font-semibold text-forest underline hover:text-forest-700">
            Log in
          </Link>{" "}
          to rate this recipe.
        </p>
      )}
    </div>
  );
}

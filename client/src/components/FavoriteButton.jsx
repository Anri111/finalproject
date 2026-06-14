import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

// Heart toggle. Hidden for logged-out users (favorites require an account).
export default function FavoriteButton({ recipeId, className = "" }) {
  const { user, setFavorites } = useAuth();
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  const isFav = user.favorites?.some((id) => String(id) === String(recipeId));

  const toggle = async (e) => {
    e.preventDefault(); // sits inside a card link — don't navigate
    if (busy) return;
    setBusy(true);
    try {
      const { favorites } = isFav
        ? await api.removeFavorite(recipeId)
        : await api.addFavorite(recipeId);
      setFavorites(favorites);
    } catch {
      // swallow; a toast system would surface this in a fuller app
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isFav}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:opacity-50 ${className}`}
      disabled={busy}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${isFav ? "fill-orange stroke-orange" : "fill-none stroke-forest"}`}
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M12 21s-6.7-4.35-9.33-8.04C.9 10.27 1.5 6.9 4.2 5.6c2-1 4.2-.3 5.4 1.3L12 9.5l2.4-2.6c1.2-1.6 3.4-2.3 5.4-1.3 2.7 1.3 3.3 4.67 1.53 7.36C18.7 16.65 12 21 12 21z" />
      </svg>
    </button>
  );
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Thin fetch wrapper. credentials:"include" ensures the session cookie rides
// along with every request (and the proxy keeps us same-origin in dev).
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // Recipes
  listRecipes: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    ).toString();
    return request(`/recipes${qs ? `?${qs}` : ""}`);
  },
  getRecipe: (slug) => request(`/recipes/${slug}`),
  createRecipe: (payload) =>
    request("/recipes", { method: "POST", body: JSON.stringify(payload) }),
  rateRecipe: (id, value) =>
    request(`/recipes/${id}/ratings`, { method: "POST", body: JSON.stringify({ value }) }),

  // Auth
  signup: (email, password) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),

  // Favorites
  addFavorite: (recipeId) =>
    request(`/users/me/favorites/${recipeId}`, { method: "POST" }),
  removeFavorite: (recipeId) =>
    request(`/users/me/favorites/${recipeId}`, { method: "DELETE" }),
};

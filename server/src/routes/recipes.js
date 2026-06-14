import { Router } from "express";
import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
import Rating from "../models/Rating.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

// Turn a title into a url-safe slug, ensuring uniqueness by appending -2, -3, ...
async function makeUniqueSlug(title) {
  const base =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "recipe";
  let slug = base;
  let n = 2;
  while (await Recipe.exists({ slug })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

// Shared aggregation stages that attach avgRating + ratingCount to recipes.
const withRatings = [
  {
    $lookup: {
      from: "ratings",
      localField: "_id",
      foreignField: "recipe",
      as: "ratings",
    },
  },
  {
    $addFields: {
      avgRating: { $ifNull: [{ $avg: "$ratings.value" }, 0] },
      ratingCount: { $size: "$ratings" },
    },
  },
  { $project: { ratings: 0 } },
];

// GET /api/recipes?q=&maxPrep=&maxCook=
// Server-side search (name or ingredient) and max prep/cook time filtering.
router.get("/", async (req, res) => {
  const { q, maxPrep, maxCook } = req.query;
  const match = {};

  if (q) {
    const rx = new RegExp(q.trim(), "i");
    match.$or = [{ title: rx }, { ingredients: rx }];
  }
  if (maxPrep !== undefined && maxPrep !== "") {
    match.prepMinutes = { $lte: Number(maxPrep) };
  }
  if (maxCook !== undefined && maxCook !== "") {
    match.cookMinutes = { $lte: Number(maxCook) };
  }

  const recipes = await Recipe.aggregate([
    { $match: match },
    { $sort: { createdAt: 1 } },
    ...withRatings,
  ]);
  res.json(recipes);
});

// POST /api/recipes — create a recipe (logged-in users only).
// Accepts a single imageUrl and stores it for both responsive sizes.
router.post("/", requireAuth, async (req, res) => {
  const b = req.body || {};
  const title = String(b.title || "").trim();
  const imageUrl = String(b.imageUrl || "").trim();
  const overview = String(b.overview || "").trim();
  const ingredients = (Array.isArray(b.ingredients) ? b.ingredients : [])
    .map((s) => String(s).trim())
    .filter(Boolean);
  const instructions = (Array.isArray(b.instructions) ? b.instructions : [])
    .map((s) => String(s).trim())
    .filter(Boolean);
  const servings = Number(b.servings);
  const prepMinutes = Number(b.prepMinutes);
  const cookMinutes = Number(b.cookMinutes);

  const errors = [];
  if (!title) errors.push("Title is required");
  if (!imageUrl) errors.push("Image URL is required");
  if (!Number.isFinite(servings) || servings < 1) errors.push("Servings must be at least 1");
  if (!Number.isFinite(prepMinutes) || prepMinutes < 0) errors.push("Prep time is invalid");
  if (!Number.isFinite(cookMinutes) || cookMinutes < 0) errors.push("Cook time is invalid");
  if (ingredients.length === 0) errors.push("Add at least one ingredient");
  if (instructions.length === 0) errors.push("Add at least one instruction");
  if (errors.length) return res.status(400).json({ error: errors.join(". ") });

  const slug = await makeUniqueSlug(title);
  const recipe = await Recipe.create({
    title,
    slug,
    image: { large: imageUrl, small: imageUrl },
    overview,
    servings,
    prepMinutes,
    cookMinutes,
    ingredients,
    instructions,
    createdBy: req.session.userId,
  });

  res.status(201).json({ recipe: { ...recipe.toObject(), avgRating: 0, ratingCount: 0 } });
});

// GET /api/recipes/:slug — full recipe + a few "more recipes" + the current
// user's own rating (if logged in).
router.get("/:slug", async (req, res) => {
  const [recipe] = await Recipe.aggregate([
    { $match: { slug: req.params.slug } },
    ...withRatings,
  ]);
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });

  const more = await Recipe.aggregate([
    { $match: { slug: { $ne: req.params.slug } } },
    { $sample: { size: 3 } },
    ...withRatings,
  ]);

  let myRating = null;
  if (req.session?.userId) {
    const r = await Rating.findOne({ user: req.session.userId, recipe: recipe._id });
    myRating = r?.value ?? null;
  }

  res.json({ recipe, more, myRating });
});

// POST /api/recipes/:id/ratings  { value: 1..5 }
// Upsert so a user can change their rating; the unique index still guarantees
// one row per (user, recipe).
router.post("/:id/ratings", requireAuth, async (req, res) => {
  const { id } = req.params;
  const value = Number(req.body.value);

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid recipe id" });
  }
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return res.status(400).json({ error: "Rating must be an integer 1-5" });
  }

  await Rating.findOneAndUpdate(
    { user: req.session.userId, recipe: id },
    { value },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const [agg] = await Rating.aggregate([
    { $match: { recipe: new mongoose.Types.ObjectId(id) } },
    { $group: { _id: "$recipe", avg: { $avg: "$value" }, count: { $sum: 1 } } },
  ]);

  res.json({ avgRating: agg?.avg ?? 0, ratingCount: agg?.count ?? 0, myRating: value });
});

export default router;

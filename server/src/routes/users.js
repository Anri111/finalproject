import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

// All routes here require a logged-in user.
router.use(requireAuth);

// POST /api/users/me/favorites/:recipeId — add (idempotent via $addToSet).
router.post("/me/favorites/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  if (!mongoose.isValidObjectId(recipeId)) {
    return res.status(400).json({ error: "Invalid recipe id" });
  }
  const user = await User.findByIdAndUpdate(
    req.session.userId,
    { $addToSet: { favorites: recipeId } },
    { new: true }
  );
  res.json({ favorites: user.favorites });
});

// DELETE /api/users/me/favorites/:recipeId — remove.
router.delete("/me/favorites/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  if (!mongoose.isValidObjectId(recipeId)) {
    return res.status(400).json({ error: "Invalid recipe id" });
  }
  const user = await User.findByIdAndUpdate(
    req.session.userId,
    { $pull: { favorites: recipeId } },
    { new: true }
  );
  res.json({ favorites: user.favorites });
});

export default router;

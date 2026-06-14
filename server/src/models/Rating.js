import mongoose from "mongoose";

// Ratings live in their own collection so recipe documents don't grow unbounded.
// The unique compound index enforces one rating per user per recipe.
const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

ratingSchema.index({ user: 1, recipe: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);

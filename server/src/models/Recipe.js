import mongoose from "mongoose";

// Mirrors the shape of starter-code/data.json. Ingredients and instructions are
// embedded arrays because they belong only to a recipe and are always read with it.
const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: {
      large: { type: String, required: true },
      small: { type: String, required: true },
    },
    overview: { type: String, default: "" },
    servings: { type: Number, min: 1 },
    prepMinutes: { type: Number, min: 0, default: 0 },
    cookMinutes: { type: Number, min: 0, default: 0 },
    ingredients: { type: [String], default: [] },
    instructions: { type: [String], default: [] },
    // Set for recipes created by a user through the app; null for seeded recipes.
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);

import mongoose from "mongoose";

// We store only the bcrypt hash, never the raw password. Favorites stay a small
// per-user array, so embedding ObjectId refs here is fine.
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

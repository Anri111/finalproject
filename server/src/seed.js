import "dotenv/config";
import dns from "node:dns";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import mongoose from "mongoose";
import Recipe from "./models/Recipe.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, "../../starter-code/data.json");

// data.json stores image paths like "./assets/...". The client serves assets
// from its public root, so strip the leading "." to get "/assets/...".
const toPublicPath = (p) => p.replace(/^\.\//, "/");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const raw = await readFile(dataPath, "utf-8");
  const recipes = JSON.parse(raw).map((r) => ({
    title: r.title,
    slug: r.slug,
    image: { large: toPublicPath(r.image.large), small: toPublicPath(r.image.small) },
    overview: r.overview,
    servings: r.servings,
    prepMinutes: r.prepMinutes,
    cookMinutes: r.cookMinutes,
    ingredients: r.ingredients,
    instructions: r.instructions,
  }));

  await Recipe.deleteMany({});
  await Recipe.insertMany(recipes);
  console.log(`Seeded ${recipes.length} recipes`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

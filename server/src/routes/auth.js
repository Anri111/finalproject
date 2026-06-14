import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = Router();

// Shape we send to the client — never expose passwordHash.
const publicUser = (u) => ({ id: u._id, email: u.email, favorites: u.favorites ?? [] });

// POST /api/auth/signup  { email, password }
router.post("/signup", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash });

  req.session.userId = user._id.toString();
  res.status(201).json(publicUser(user));
});

// POST /api/auth/login  { email, password }
router.post("/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const user = await User.findOne({ email });
  // Compare even on missing user to avoid leaking which emails exist via timing.
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!ok) return res.status(401).json({ error: "Invalid email or password" });

  req.session.userId = user._id.toString();
  res.json(publicUser(user));
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

// GET /api/auth/me — who is logged in (null if nobody).
router.get("/me", async (req, res) => {
  if (!req.session?.userId) return res.json(null);
  const user = await User.findById(req.session.userId);
  if (!user) return res.json(null);
  res.json(publicUser(user));
});

export default router;

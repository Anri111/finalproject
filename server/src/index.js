import "dotenv/config";
import dns from "node:dns";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

// Some routers/ISP resolvers refuse the SRV-type DNS lookup that mongodb+srv://
// requires, causing "querySrv ECONNREFUSED". Point Node at public resolvers so
// the cluster's SRV record resolves regardless of the local network.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// --- Core middleware ---
// Parse JSON request bodies so req.body works on POST/PUT.
app.use(express.json());

// CORS: the client runs on a different origin (Vite dev = :5173) than the API
// (:4000). `credentials: true` + a fixed origin is REQUIRED for the session
// cookie to be sent and accepted cross-origin. A wildcard origin won't work
// with credentials.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// --- Sessions (server-side, stored in Mongo) ---
// express-session issues a cookie holding only a session id; the actual session
// data lives in Mongo via connect-mongo. This is the "server sessions" approach
// you chose. In production you'd set cookie.secure = true behind HTTPS.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    },
  })
);

// --- Health check (handy for verifying the server is up) ---
app.get("/api/health", (req, res) => res.json({ ok: true }));

// --- Routes ---
import recipesRouter from "./routes/recipes.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
app.use("/api/recipes", recipesRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

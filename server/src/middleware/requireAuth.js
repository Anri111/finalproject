// Gate for protected routes. With server sessions, "logged in" simply means the
// session holds a userId (set at login/signup).
export default function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

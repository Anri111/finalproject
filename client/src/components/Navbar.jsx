import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/recipes", label: "Recipes" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef(null);

  // Close the mobile menu on Escape and on clicks outside the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const linkClass = ({ isActive }) =>
    `text-base text-ink transition-colors hover:text-orange focus-visible:text-orange focus-visible:outline-none ${
      isActive ? "border-b-2 border-orange pb-0.5" : ""
    }`;

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="border-b border-black/10 bg-cream">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 focus-visible:outline-none">
          <img src="/assets/images/logo.svg" alt="" className="h-7 w-7" />
          <span className="font-heading text-lg font-extrabold text-forest">
            Healthy Recipe Finder
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <NavLink to="/recipes/new" className={linkClass}>
                New recipe
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="text-base text-ink transition-colors hover:text-orange focus-visible:text-orange focus-visible:outline-none"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-base text-ink transition-colors hover:text-orange focus-visible:text-orange focus-visible:outline-none"
            >
              Log in
            </Link>
          )}
          <Link
            to="/recipes"
            className="rounded-lg bg-forest px-5 py-2.5 text-base font-bold text-cream transition-colors hover:bg-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            Browse recipes
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest md:hidden"
        >
          <img src="/assets/images/icon-hamburger-menu.svg" alt="" className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="mx-auto max-w-6xl px-6 pb-6 md:hidden"
        >
          <div className="rounded-xl bg-white p-2 shadow-md">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-ink transition-colors hover:bg-cream focus-visible:bg-cream focus-visible:outline-none ${
                        isActive ? "text-orange" : ""
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-col gap-2 border-t border-black/10 p-2">
              {user ? (
                <>
                  <NavLink
                    to="/recipes/new"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-4 py-2 text-ink hover:bg-cream focus-visible:bg-cream focus-visible:outline-none"
                  >
                    New recipe
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg px-4 py-2 text-left text-ink hover:bg-cream focus-visible:bg-cream focus-visible:outline-none"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-ink hover:bg-cream focus-visible:bg-cream focus-visible:outline-none"
                >
                  Log in
                </Link>
              )}
              <Link
                to="/recipes"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-forest px-5 py-3 text-center font-bold text-cream transition-colors hover:bg-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                Browse recipes
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

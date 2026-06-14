import { useEffect, useRef, useState } from "react";

// Single-select dropdown of "max minutes" options with a Clear action.
// `value` is a string ("" when cleared); `options` is an array of numbers.
export default function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-lg bg-white px-4 py-2.5 text-sm text-ink shadow-sm ring-1 ring-black/10 transition hover:ring-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:w-44"
      >
        <span>
          {label}
          {value !== "" && <span className="ml-1 font-bold text-forest">· {value}m</span>}
        </span>
        <img
          src="/assets/images/icon-chevron-down.svg"
          alt=""
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-10 mt-2 w-full min-w-44 rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/10"
        >
          {options.map((opt) => {
            const selected = String(opt) === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(String(opt));
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-ink hover:bg-cream focus-visible:bg-cream focus-visible:outline-none"
                >
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border ${
                      selected ? "border-forest" : "border-black/30"
                    }`}
                  >
                    {selected && <span className="h-2 w-2 rounded-full bg-forest" />}
                  </span>
                  {opt} minutes
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="mt-1 w-full rounded-md px-2 py-2 text-left text-sm text-muted hover:bg-cream focus-visible:bg-cream focus-visible:outline-none"
            >
              Clear
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

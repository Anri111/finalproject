export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <img
        src="/assets/images/icon-search.svg"
        alt=""
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or ingredient..."
        aria-label="Search recipes by name or ingredient"
        className="w-full rounded-lg bg-white py-2.5 pl-9 pr-4 text-sm text-ink shadow-sm ring-1 ring-black/10 transition placeholder:text-muted hover:ring-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      />
    </div>
  );
}

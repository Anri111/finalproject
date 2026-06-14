// Compact servings / prep / cook row used on cards and the detail header.
export default function RecipeMeta({ servings, prepMinutes, cookMinutes, className = "" }) {
  const items = [
    { icon: "icon-servings.svg", label: `Servings: ${servings}` },
    { icon: "icon-prep-time.svg", label: `Prep: ${prepMinutes} mins` },
    { icon: "icon-cook-time.svg", label: `Cook: ${cookMinutes} min` },
  ];
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted ${className}`}>
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2">
          <img src={`/assets/images/${it.icon}`} alt="" className="h-4 w-4" />
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

import type { ReactNode } from "react";
import type { Station } from "@/lib/stations";

// Console logos: single-colour transparent PNGs in /public/icons, painted with
// currentColor through a CSS mask so they match the line icons. [width/height ratio]
const LOGOS = { ps5: 290 / 391, ps4: 3603 / 778, xbox: 275 / 278 };

// Line icons (24px grid, lucide-style). Station ids double as icon names.
const ICONS: Record<Exclude<Station["id"], keyof typeof LOGOS> | "ac" | "new" | "trophy" | "calendar", ReactNode> = {
  pc: (
    <>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M8 21h8M12 17v4M6 13l3-3 2 2 4-4 3 3" />
    </>
  ),
  snooker: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10.5" r="4.5" />
      <path d="M12 9.2v.01M12 12v.01" />
    </>
  ),
  sim: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 14.5V22M9.6 11.4 2.2 10M14.4 11.4l7.4-1.4" />
    </>
  ),
  vr: (
    <>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4l-2-3h-2l-2 3H5a2 2 0 0 1-2-2Z" />
      <circle cx="8" cy="11" r="1.5" />
      <circle cx="16" cy="11" r="1.5" />
    </>
  ),
  ac: <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1M9 4l3 2 3-2M9 20l3-2 3 2M4 9l2 3-2 3M20 9l-2 3 2 3" />,
  new: (
    <>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" />
      <path d="m19 15 .8 2.2 2.2.8-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />
    </>
  ),
  trophy: (
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .5-.5 1-1 1.2C7.9 18.8 7 20.2 7 22M14 14.7V17c0 .5.5 1 1 1.2 1.1.6 2 2 2 3.8M18 2H6v7a6 6 0 0 0 12 0Z" />
  ),
  calendar: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
    </>
  ),
};

// className sets the height; width follows the icon's aspect ratio
export function Icon({ name, className = "h-6" }: { name: keyof typeof ICONS | keyof typeof LOGOS; className?: string }) {
  if (name in LOGOS) {
    const mask = `url(/icons/${name}.png) center / contain no-repeat`;
    return (
      <span
        aria-hidden
        className={`block bg-current ${className}`}
        style={{ aspectRatio: LOGOS[name as keyof typeof LOGOS], mask, WebkitMask: mask }}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`aspect-square ${className}`}
    >
      {ICONS[name as keyof typeof ICONS]}
    </svg>
  );
}

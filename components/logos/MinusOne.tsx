// Placeholder until the cafe's real logo is in hand: a controller whose
// d-pad is a minus and whose face buttons read "1".
export function MinusOneLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 64" fill="none" aria-hidden className={className}>
      <defs>
        {/* userSpaceOnUse: a bounding-box gradient paints nothing on the flat minus */}
        <linearGradient id="mo-logo" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="120" y2="64">
          <stop offset="0" stopColor="#ff5a6a" />
          <stop offset="1" stopColor="#d0102a" />
        </linearGradient>
      </defs>
      <g className="logo-draw" stroke="url(#mo-logo)" strokeLinecap="round" strokeLinejoin="round">
        <path
          pathLength={1}
          strokeWidth="6"
          d="M34 8H86C100 8 106 15 109 27L114 47C116 57 109 62 102 58C97 55 94 50 90 45H30C26 50 23 55 18 58C11 62 4 57 6 47L11 27C14 15 20 8 34 8Z"
        />
        <path pathLength={1} strokeWidth="8" d="M24 27H42" />
        <path pathLength={1} strokeWidth="8" d="M84 22L91 17V37" />
      </g>
      <circle cx="54" cy="21" r="2.5" fill="url(#mo-logo)" />
      <circle cx="66" cy="21" r="2.5" fill="url(#mo-logo)" />
    </svg>
  );
}

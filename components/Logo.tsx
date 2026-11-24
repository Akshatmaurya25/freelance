// Redrawn from the cafe's logo: a controller whose grips cross into an infinity loop.
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 64" fill="none" aria-hidden className={className}>
      <defs>
        <linearGradient id="ig-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5a6a" />
          <stop offset="1" stopColor="#d0102a" />
        </linearGradient>
      </defs>
      <g className="logo-draw" stroke="url(#ig-logo)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <path pathLength={1} d="M12 10 Q8 56 36 52 Q50 50 60 33 L78 12" />
        <path pathLength={1} d="M108 10 Q112 56 84 52 Q70 50 60 33 L42 12" />
      </g>
      <path fill="url(#ig-logo)" d="M24 18h6v6h6v6h-6v6h-6v-6h-6v-6h6z" />
      <circle cx="93" cy="27" r="10.5" fill="url(#ig-logo)" />
      {[[93, 21.5], [93, 32.5], [87.5, 27], [98.5, 27]].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="2.4" fill="#08080b" />
      ))}
    </svg>
  );
}

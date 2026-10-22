/** Static, CSS-animated stand-in for the hero scene (no WebGL needed). */
export function HeroFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
      <svg viewBox="0 0 400 400" className="h-[min(88%,34rem)] w-auto max-w-full">
        <defs>
          <radialGradient id="hf-core" cx="50%" cy="40%" r="60%">
            <stop offset="0" stopColor="#3a4270" />
            <stop offset="1" stopColor="#12141b" />
          </radialGradient>
          <linearGradient id="hf-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6a8bff" />
            <stop offset="1" stopColor="#9b7bff" />
          </linearGradient>
        </defs>
        <g className="orbit-spin" style={{ transformOrigin: '200px 200px' }}>
          <ellipse cx="200" cy="200" rx="170" ry="62" fill="none" stroke="#6a8bff" strokeOpacity=".3" transform="rotate(-18 200 200)" />
          <circle cx="368" cy="160" r="6" fill="#6a8bff" />
        </g>
        <g className="orbit-spin-rev" style={{ transformOrigin: '200px 200px' }}>
          <ellipse cx="200" cy="200" rx="140" ry="110" fill="none" stroke="#9b7bff" strokeOpacity=".28" transform="rotate(28 200 200)" />
          <circle cx="62" cy="228" r="5" fill="#9b7bff" />
        </g>
        <polygon points="200,118 268,160 268,240 200,282 132,240 132,160" fill="url(#hf-core)" stroke="url(#hf-stroke)" strokeWidth="1.5" />
        <polygon points="200,118 268,160 200,200 132,160" fill="#ffffff" fillOpacity=".06" />
        <polygon points="200,200 268,160 268,240 200,282" fill="#000000" fillOpacity=".18" />
        <circle cx="200" cy="200" r="16" fill="#9b7bff" className="pulse-soft" />
      </svg>
    </div>
  )
}

/** Static stand-in for the Digital Universe. The quick-link buttons below it keep it useful. */
export function UniverseFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center px-6 text-center" aria-hidden="true">
      <svg viewBox="0 0 400 260" className="h-full max-h-[22rem] w-auto opacity-90">
        <g fill="none" stroke="#6a8bff" strokeOpacity=".3">
          <ellipse cx="200" cy="130" rx="150" ry="80" />
          <ellipse cx="200" cy="130" rx="100" ry="52" />
        </g>
        <g stroke="#9b7bff" strokeOpacity=".35">
          <line x1="200" y1="130" x2="60" y2="60" />
          <line x1="200" y1="130" x2="340" y2="60" />
          <line x1="200" y1="130" x2="70" y2="205" />
          <line x1="200" y1="130" x2="335" y2="205" />
        </g>
        <polygon points="200,98 228,114 228,146 200,162 172,146 172,114" fill="#171a22" stroke="#6a8bff" />
        <circle cx="200" cy="130" r="7" fill="#9b7bff" className="pulse-soft" />
        {[
          [60, 60],
          [340, 60],
          [70, 205],
          [335, 205],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="9" fill="#14161a" stroke="#6a8bff" />
        ))}
      </svg>
    </div>
  )
}

/**
 * The Vinay monogram — a serif "V" reduced to a technical mark.
 * Drawn as paths so it renders identically everywhere, with no font dependency.
 */
export function Monogram({
  className = 'h-6 w-6',
  accent = true,
}: {
  className?: string
  accent?: boolean
}) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path
        d="M8.5 8.5 L16 23 L23.5 8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {accent && <rect x="7" y={25.6} width="18" height="1.4" fill="#6a8bff" opacity={0.9} />}
    </svg>
  )
}

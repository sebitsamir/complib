type ComplibMarkProps = {
  className?: string;
};

/**
 * Interlocking 8-piece mark — flat paths, no background.
 * Inherits color from `currentColor` (theme-aware).
 */
export function ComplibMark({ className = "h-9 w-9" }: ComplibMarkProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Top-left hook */}
      <path d="M4 0h14v14h-4v4H0V4C0 1.79 1.79 0 4 0z" />
      {/* Top-right hook */}
      <path d="M52 0H38v14h4v4h14V4c0-2.21-1.79-4-4-4z" />
      {/* Bottom-right hook */}
      <path d="M56 52c0 2.21-1.79 4-4 4H38V42h-4v-4h14v14z" />
      {/* Bottom-left hook */}
      <path d="M4 56h14V42h-4v-4H0v14c0 2.21 1.79 4 4 4z" />
      {/* Top bar */}
      <path d="M22 0h12v14H22V0z" />
      {/* Right bar */}
      <path d="M42 22h14v12H42V22z" />
      {/* Bottom bar */}
      <path d="M22 42h12v14H22V42z" />
      {/* Left bar */}
      <path d="M0 22h14v12H0V22z" />
    </svg>
  );
}

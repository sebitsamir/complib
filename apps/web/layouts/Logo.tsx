import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string | null;
  className?: string;
  /** Show wordmark next to the mark (default true). */
  wordmark?: boolean;
}

const sizeMap = {
  sm: { mark: 22, text: "text-base", gap: "gap-2" },
  md: { mark: 28, text: "text-lg", gap: "gap-2.5" },
  lg: { mark: 34, text: "text-xl", gap: "gap-3" },
} as const;

function CompLibMark({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      className="shrink-0 text-foreground"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4 0h14v14h-4v4H0V4C0 1.79 1.79 0 4 0z" />
      <path d="M52 0H38v14h4v4h14V4c0-2.21-1.79-4-4-4z" />
      <path d="M56 52c0 2.21-1.79 4-4 4H38V42h-4v-4h14v14z" />
      <path d="M4 56h14V42h-4v-4H0v14c0 2.21 1.79 4 4 4z" />
      <path d="M22 0h12v14H22V0z" />
      <path d="M42 22h14v12H42V22z" />
      <path d="M22 42h12v14H22V42z" />
      <path d="M0 22h14v12H0V22z" />
    </svg>
  );
}

export function Logo({
  size = "md",
  href = "/",
  className = "",
  wordmark = true,
}: LogoProps) {
  const s = sizeMap[size];

  const inner = (
    <span
      className={`inline-flex items-center ${s.gap} font-display font-bold tracking-tight text-foreground ${className}`}
    >
      <CompLibMark size={s.mark} />
      {wordmark ? (
        <span className={`${s.text} leading-none`}>
          Comp<span className="text-accent">Lib</span>
        </span>
      ) : (
        <span className="sr-only">CompLib</span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex transition-opacity duration-200 hover:opacity-80"
        aria-label="CompLib home"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}

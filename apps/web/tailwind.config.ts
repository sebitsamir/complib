import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Syne", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        ink: "hsl(var(--ink))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          soft: "hsl(var(--accent-soft))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },
      keyframes: {
        "hero-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        "mesh-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(1%, -0.8%, 0) scale(1.03)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.85)" },
        },
        "preview-rise": {
          "0%": { opacity: "0", transform: "translateY(28px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "hero-glow": "hero-glow 10s ease-in-out infinite",
        "mesh-drift": "mesh-drift 18s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2.2s ease-in-out infinite",
        "preview-rise": "preview-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "cursor-blink": "cursor-blink 1.1s step-end infinite",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Semantic aliases (compatibilidade) */
        background:  "var(--color-background)",
        surface:     "var(--color-surface)",
        foreground:  "var(--color-foreground)",
        muted:       "var(--color-muted)",
        border:      "var(--color-border)",
        dark:        "var(--color-dark)",
        "on-dark":   "var(--color-on-dark)",
        /* Tokens primitivos V2.5 */
        black:       "var(--color-black)",
        graphite:    "var(--color-graphite)",
        gray:        "var(--color-gray)",
        "light-gray":"var(--color-light-gray)",
        beige:       "var(--color-beige)",
        "warm-white":"var(--color-warm-white)",
        white:       "var(--color-white)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Montserrat", "system-ui", "sans-serif"],
        sans:    ["var(--font-sans)",    "Montserrat", "system-ui", "sans-serif"],
        serif:   ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
      },
      maxWidth: {
        narrow:  "var(--container-narrow)",
        content: "var(--container-content)",
        wide:    "var(--container-wide)",
      },
      borderRadius: {
        none: "0px",
        sm:   "2px",
      },
      transitionDuration: {
        fast:   "180ms",
        normal: "280ms",
        slow:   "480ms",
      },
    },
  },
  plugins: [],
};

export default config;

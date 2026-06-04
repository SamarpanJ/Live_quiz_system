import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#000000",
          subtle: "#0a0a0a",
          raised: "#111111",
          card: "#0d0d0d",
        },
        border: "rgba(255,255,255,0.1)",
        ink: {
          DEFAULT: "#fafafa",
          dim: "#b8b8c3",
          faint: "#9494a1",
        },
        brand: {
          DEFAULT: "#7c6cff",
          soft: "#9b92ff",
          ink: "#d4d0ff",
        },
        accent: "#5ec8e8",
        success: {
          DEFAULT: "#d4b872",
          soft: "#e8d49a",
        },
        good: "#d4b872",
        bad: "#fb7185",
        warn: "#e8b84a",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,108,255,0.45), 0 0 32px -6px rgba(124,108,255,0.35)",
        card: "0 0 0 1px rgba(255,255,255,0.06) inset, 0 1px 0 rgba(255,255,255,0.04) inset",
        panel:
          "0 0 0 1px rgba(255,255,255,0.08), 0 1px 0 rgba(255,255,255,0.05) inset, 0 24px 48px -20px rgba(0,0,0,0.9)",
        "panel-lg":
          "0 0 0 1px rgba(255,255,255,0.1), 0 1px 0 rgba(255,255,255,0.06) inset, 0 32px 64px -24px rgba(0,0,0,0.95)",
        lift: "0 0 0 1px rgba(124,108,255,0.2), 0 16px 40px -12px rgba(124,108,255,0.2)",
      },
      backgroundImage: {
        "grid-faint":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
        "surface-shine":
          "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 28%)",
      },
      backgroundSize: {
        "grid-faint": "32px 32px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.5" },
          "70%": { transform: "scale(1.12)", opacity: "0" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.5s infinite",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

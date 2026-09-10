import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#080A10",
        surface: "#0E1119",
        elevated: "#141926",
        "elevated-2": "#1B2131",
        hairline: "#242C3F",
        "hairline-soft": "#1A2032",
        ink: "#E9ECF4",
        "ink-muted": "#8991A8",
        "ink-faint": "#5B6377",
        forge: {
          DEFAULT: "#FF7A3D",
          hot: "#FFB84D",
          dim: "#C25A2A",
          50: "#FFF1E8",
        },
        cyan: {
          DEFAULT: "#45D9C7",
          dim: "#2A9E92",
        },
        violet: {
          DEFAULT: "#8C7BFF",
        },
        danger: "#FF5D6C",
        amber: "#FFC24B",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "forge-glow":
          "radial-gradient(circle at 50% 0%, rgba(255,122,61,0.16), transparent 60%)",
        "seam-gradient":
          "linear-gradient(90deg, transparent, #FF7A3D, #FFB84D, #45D9C7, transparent)",
        "grid-lines":
          "linear-gradient(rgba(233,236,244,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(233,236,244,0.035) 1px, transparent 1px)",
      },
      keyframes: {
        "seam-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(var(--r, 0deg))" },
          "50%": { transform: "translateY(-14px) rotate(var(--r, 0deg))" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "spark-rise": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(-60px) scale(0.3)", opacity: "0" },
        },
        typing: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "seam-flow": "seam-flow 6s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        "spark-rise": "spark-rise 1.8s ease-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
      boxShadow: {
        forge: "0 0 0 1px rgba(255,122,61,0.25), 0 8px 30px -8px rgba(255,122,61,0.35)",
        glass: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 32px -12px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;

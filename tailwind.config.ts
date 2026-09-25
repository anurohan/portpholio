import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/sections/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#080B10",
          900: "#080B10",
          800: "#0C1118",
          700: "#121A24",
          600: "#1A2430",
        },
        signal: {
          DEFAULT: "#35E0D0",
          soft: "#7CF0E4",
          deep: "#0FB9AC",
        },
        ember: {
          DEFAULT: "#FF7A3D",
          soft: "#FFA875",
          deep: "#E85A1C",
        },
        copper: "#C9803B",
        steel: "#8FA3B8",
        chalk: "#EAF2F2",
        muted: "#7C8A96",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.28em",
      },
      maxWidth: {
        container: "1240px",
      },
      screens: {
        xs: "420px",
      },
      keyframes: {
        "pulse-line": {
          "0%,100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        "float-slow": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "pulse-line": "pulse-line 2.6s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        scan: "scan 3.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

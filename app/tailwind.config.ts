import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "button-bg": "#192634",
      },
      fontFamily: {
        lexend: ["var(--font-lexend)", "sans-serif"],
        akshar: ["var(--font-akshar)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        ibmMono: ["var(--font-ibm-mono)", "monospace"],
        chakra: ["var(--font-chakra)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        alata: ["var(--font-alata)", "sans-serif"],
      },
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
      },
      keyframes: {
        shape1: {
          "0%, 100%": { transform: "translate(-48px, -16px)" },
          "33%": { transform: "translate(0, 0)" },
          "66%": { transform: "translate(48px, 16px)" },
        },
        shape2: {
          "0%, 100%": { transform: "translate(-12px, 16px)" },
          "33%": { transform: "translate(36px, -24px)" },
          "66%": { transform: "translate(-36px, 24px)" },
        },
        shape3: {
          "0%, 100%": { transform: "translate(20px, -16px)" },
          "33%": { transform: "translate(-36px, 24px)" },
          "66%": { transform: "translate(36px, -24px)" },
        },
        shape4: {
          "0%, 100%": { transform: "translate(48px, 16px)" },
          "33%": { transform: "translate(0, 0)" },
          "66%": { transform: "translate(-48px, -16px)" },
        },
        "gradient-move": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "shape-1": "shape1 6s 1s ease-out infinite",
        "shape-2": "shape2 6s ease-in infinite",
        "shape-3": "shape3 6s ease-out infinite",
        "shape-4": "shape4 6s 1s ease-in infinite",
        "gradient-move": "gradient-move 6s ease infinite",
      },
    },
  },
  plugins: [lineClamp],
} satisfies Config;

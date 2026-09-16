import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        poGreen: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#10b981",
          600: "#00a651", // Exact match for Purchase Order emerald green header
          700: "#047857",
          800: "#065f46",
        },
        poYellow: {
          400: "#ffca28",
          500: "#ffc107", // Exact match for Total highlight box
          600: "#e0a800",
        },
      },
    },
  },
  plugins: [],
};
export default config;

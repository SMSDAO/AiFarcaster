import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bg: "#0d0d1a",
        bgSecondary: "#130f24",
        sidebarStart: "#100e1f",
        sidebarEnd: "#14112a",
        purple: {
          DEFAULT: "#7c3aed",
          light: "#a855f7",
        },
        blue: {
          DEFAULT: "#2563eb",
          light: "#60a5fa",
        },
        green: {
          DEFAULT: "#059669",
          light: "#34d399",
        },
        orange: {
          DEFAULT: "#d97706",
          light: "#fbbf24",
        },
        textPrimary: "#f0eeff",
        textSecondary: "#8b8ab0",
        textMuted: "#4b4580",
        border: "#2d2560",
        card: "#1a1435",
        cardAlt: "#161330",
      },
      width: {
        sidebar: "232px",
      },
      minWidth: {
        sidebar: "232px",
      },
      height: {
        header: "60px",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: "#1a1a2e",
        "sidebar-hover": "#16213e",
        accent: "#e94560",
        surface: "#0f3460",
      },
    },
  },
  plugins: [],
};

export default config;

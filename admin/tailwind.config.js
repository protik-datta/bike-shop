/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0D10",
          900: "#12151A",
          800: "#1A1E25",
          700: "#242933",
          600: "#343B47",
          500: "#4A5262",
          400: "#6B7385",
          300: "#9AA2B2",
          200: "#C7CCD6",
          100: "#E7E9ED",
        },
        ember: {
          600: "#C4501B",
          500: "#E8631F",
          400: "#F5822E",
          300: "#FAA85A",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Rubik",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          50: "#f0f4ff",
          500: "#2F00FF",
          600: "#653fd9",
          700: "#4a28af",
        },
        secondary: {
          500: "#6E46E6",
          600: "#4d2ab2",
        },
        neutral: {
          500: "#717191",
        },
      },
      fontSize: {
        "rate-label": ["12px", { lineHeight: "116%", letterSpacing: "0%" }],
        "rate-value": ["12px", { lineHeight: "116%", letterSpacing: "0%" }],
        "input-text": ["16px", { lineHeight: "24px", letterSpacing: "0%" }],
      },
    },
  },
  plugins: [],
};

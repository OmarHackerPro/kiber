/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "sans-serif"]
      },
      colors: {
        background: {
          DEFAULT: "#0B1020",
          soft: "#111827",
          card: "#020617"
        },
        accent: {
          blue: "#3B82F6",
          purple: "#8B5CF6",
          green: "#22C55E",
          amber: "#F59E0B"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: []
};





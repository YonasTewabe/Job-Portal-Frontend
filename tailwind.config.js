/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      gridTemplateColumns: {
        "70-30": "70% 28%",
      },
      colors: {
        // Brand primary — deep navy-blue (high contrast on both light and dark bg)
        brand: {
          50:  "#eff6ff",  // very light blue tint — backgrounds
          100: "#dbeafe",  // light blue — hover backgrounds
          200: "#bfdbfe",  // borders, dividers
          300: "#93c5fd",  // disabled states
          400: "#60a5fa",  // icons on dark bg
          500: "#3b82f6",  // mid-tone — readable on white
          600: "#2563eb",  // primary buttons — 4.5:1 on white ✓
          700: "#1d4ed8",  // hover state — 5.9:1 on white ✓
          800: "#1e40af",  // active/pressed — 7.2:1 on white ✓
          900: "#1e3a8a",  // dark surfaces text — passes AA on light ✓
        },
        // Keep legacy alias so existing bg-background classes still work
        background: "#2563eb",
      },
      borderRadius: {
        "xl":  "0.75rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      boxShadow: {
        card:        "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
        "card-hover":"0 4px 14px 0 rgb(0 0 0 / 0.11), 0 2px 4px -2px rgb(0 0 0 / 0.07)",
        float:       "0 8px 28px -4px rgb(0 0 0 / 0.14)",
      },
    },
  },
  plugins: [],
};

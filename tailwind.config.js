/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Ensure brand palette utilities are always generated
    "bg-brand-50", "bg-brand-100", "bg-brand-600", "bg-brand-700",
    "text-brand-600", "text-brand-700", "text-brand-800", "text-brand-900",
    "border-brand-200", "border-brand-600",
    "hover:bg-brand-50", "hover:bg-brand-100", "hover:bg-brand-600", "hover:bg-brand-700",
    "hover:text-brand-700", "hover:text-brand-800", "hover:text-white",
    "from-brand-50", "from-brand-100", "via-brand-100", "to-slate-50",
    "ring-brand-200", "focus:ring-brand-500",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      gridTemplateColumns: {
        "70-30": "70% 28%",
      },
      colors: {
        brand: {
          50:  "var(--brand-50)",
          100: "var(--brand-100)",
          200: "var(--brand-200)",
          300: "var(--brand-300)",
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
          800: "var(--brand-800)",
          900: "var(--brand-900)",
        },
        background: "var(--brand-600)",
      },
      borderRadius: {
        xl:  "0.75rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      boxShadow: {
        card:         "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
        "card-hover": "0 4px 14px 0 rgb(0 0 0 / 0.11), 0 2px 4px -2px rgb(0 0 0 / 0.07)",
        float:        "0 8px 28px -4px rgb(0 0 0 / 0.14)",
      },
    },
  },
  plugins: [],
};

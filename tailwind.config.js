/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "btn-primary", "btn-secondary", "btn-outline-brand", "btn-ghost", "btn-danger", "btn-success", "btn-warning",
    "link-brand", "link-muted", "link-nav", "nav-item-active", "nav-glass", "hero-surface", "hero-orb",
    "surface-card", "surface-card-interactive", "section-eyebrow", "auth-backdrop", "cta-banner",
    "stagger-1", "stagger-2", "stagger-3", "stagger-4",
    "animate-fade-up", "animate-fade-in", "animate-float", "animate-pulse-soft",
    "shadow-glow", "shadow-inner-soft",
    "bg-brand-50", "bg-brand-100", "bg-brand-600", "bg-brand-700",
    "text-brand-100", "text-brand-600", "text-brand-700", "text-brand-800", "text-brand-900",
    "border-brand-100", "border-brand-200", "border-brand-600",
    "hover:bg-brand-50", "hover:bg-brand-100", "hover:bg-brand-700",
    "hover:text-brand-700", "hover:text-brand-800",
    "focus:ring-brand-400", "focus:ring-brand-500",
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
        glow:         "0 0 40px -8px rgb(37 99 235 / 0.35)",
        "inner-soft": "inset 0 1px 0 0 rgb(255 255 255 / 0.6)",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease-out both",
        "fade-in":    "fadeIn 0.5s ease-out both",
        "float":      "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%":      { opacity: "1" },
        },
      },
      backgroundImage: {
        "grid-pattern": "radial-gradient(circle, rgb(148 163 184 / 0.35) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-sm": "24px 24px",
      },
    },
  },
  plugins: [],
};

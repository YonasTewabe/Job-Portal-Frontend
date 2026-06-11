import { BRAND } from "../constants/theme";

/**
 * AppLogo — SVG logo for the Application Tracker platform.
 *
 * Concept: a stylised briefcase with an upward-trending arrow inside,
 * representing career growth and job tracking. Geometric, flat, modern.
 *
 * Props:
 *   size    — height in px (width scales proportionally), default 32
 *   variant — "color" (default) | "white" | "dark"
 *   showText — render the wordmark beside the mark, default false
 */
const Logo = ({ size = 32, variant = "color", showText = false }) => {
  const mark  = variant === "white" ? "#ffffff" : variant === "dark" ? "#111827" : BRAND[600];
  const accent = variant === "white" ? "#ffffff" : BRAND[400];
  const text  = variant === "white" ? "#ffffff" : "#111827";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      {/* ── Mark ──────────────────────────────────────────────────────── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Application Tracker logo"
        role="img"
      >
        {/* Briefcase body */}
        <rect x="4" y="14" width="32" height="22" rx="3.5" fill={mark} />

        {/* Briefcase handle */}
        <path
          d="M14 14V11a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"
          stroke={mark}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Clasp / centre bar */}
        <rect x="17" y="22" width="6" height="4" rx="1" fill="white" opacity="0.25" />

        {/* Upward arrow — career growth */}
        <polyline
          points="13,30 17,24 21,27 27,20"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <polyline
          points="24,20 27,20 27,23"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* ── Wordmark ───────────────────────────────────────────────────── */}
      {showText && (
        <span
          style={{
            fontWeight: 700,
            fontSize: size * 0.55,
            letterSpacing: "-0.02em",
            color: text,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          App
          <span style={{ color: mark, fontWeight: 800 }}>Track</span>
        </span>
      )}
    </span>
  );
};

export default Logo;

import { APP_NAME, APP_NAME_AMHARIC } from "../constants/brand";

/** Ethiopian-inspired greens used in the app mark */
const ETHIO = {
  400: "#34d399",
  500: "#10b981",
  600: "#059669",
  700: "#047857",
  800: "#065f46",
};

/**
 * Dereja app icon — three ascending steps on a rounded-square mark.
 * Reads as career progression (dereja = path / stage / level in Amharic).
 *
 * Props:
 *   size     — mark size in px (default 32)
 *   variant  — "color" | "white" | "dark" | "mono"
 *   showText — render wordmark beside the mark
 */
const Logo = ({ size = 32, variant = "color", showText = false }) => {
  const isWhite = variant === "white";
  const isDark = variant === "dark";
  const isMono = variant === "mono";
  const useGradientBg = variant === "color";

  const mark = isWhite ? "#ffffff" : isDark || isMono ? "#111827" : ETHIO[600];
  const text = isWhite ? "#ffffff" : "#111827";
  const uid = `dj-${variant}`;

  const barFill = (opacity) => {
    if (useGradientBg) return { fill: "#ffffff", opacity };
    if (isWhite) return { fill: "#ffffff", opacity };
    return { fill: mark, opacity };
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`${APP_NAME} logo`}
        role="img"
      >
        {useGradientBg && (
          <defs>
            <linearGradient
              id={`${uid}-bg`}
              x1="6"
              y1="4"
              x2="34"
              y2="36"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={ETHIO[500]} />
              <stop offset="1" stopColor={ETHIO[800]} />
            </linearGradient>
          </defs>
        )}

        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="11"
          fill={
            useGradientBg ? `url(#${uid}-bg)` : isWhite ? "rgba(255,255,255,0.14)" : "transparent"
          }
          stroke={useGradientBg ? "none" : isWhite ? "rgba(255,255,255,0.4)" : mark}
          strokeWidth="1.5"
        />

        {/* Ascending career steps */}
        <rect x="10" y="25" width="7" height="9" rx="2" {...barFill(0.45)} />
        <rect x="18.5" y="18" width="7" height="16" rx="2" {...barFill(0.72)} />
        <rect x="27" y="10" width="7" height="24" rx="2" {...barFill(1)} />

        {/* Upward tip on the top step */}
        <path
          d="M30.5 13.5L33.5 10.5M30.5 13.5L27.5 10.5"
          stroke={useGradientBg ? ETHIO[700] : isWhite ? "#ffffff" : mark}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span
          style={{
            display: "inline-flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0.1em",
            lineHeight: 1.05,
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: size * 0.62,
              letterSpacing: "-0.03em",
              color: text,
            }}
          >
            Der
            <span style={{ color: isWhite ? "#ffffff" : mark }}>eja</span>
          </span>
          <span
            style={{
              fontSize: size * 0.3,
              fontWeight: 600,
              color: isWhite ? "rgba(255,255,255,0.72)" : "#9ca3af",
              letterSpacing: "0.02em",
            }}
          >
            {APP_NAME_AMHARIC}
          </span>
        </span>
      )}
    </span>
  );
};

export default Logo;

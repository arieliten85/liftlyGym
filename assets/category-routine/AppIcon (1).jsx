import { useState } from "react";

const Icon = ({ size = 256 }) => {
  const r = size * 0.218;
  const gap = size * 0.07;
  const barH = size * 0.109;
  const barRadius = barH / 2;
  const paddingRight = size * 0.172;

  const bars = [
    {
      width: size * 0.406,
      gradient: ["#177d8f", "#1fa8bd", "#1a96ab"],
      glow: "rgba(29,158,179,0.5)",
    },
    {
      width: size * 0.594,
      gradient: ["#1ebcd6", "#35d4ec", "#28cce4"],
      glow: "rgba(53,212,236,0.55)",
    },
    {
      width: size * 0.672,
      gradient: ["#c2d8e2", "#eaf4f8", "#d2e6f0"],
      glow: "rgba(220,240,248,0.3)",
    },
  ];

  const totalH = bars.length * barH + (bars.length - 1) * gap;
  const startY = (size - totalH) / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Background gradient */}
        <radialGradient id="bg" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2e3a4a" />
          <stop offset="55%" stopColor="#1a2330" />
          <stop offset="100%" stopColor="#111820" />
        </radialGradient>

        {/* Inner light sheen */}
        <radialGradient id="sheen" cx="50%" cy="15%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Bar gradients */}
        {bars.map((b, i) => (
          <linearGradient key={i} id={`bar${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={b.gradient[0]} />
            <stop offset="55%" stopColor={b.gradient[1]} />
            <stop offset="100%" stopColor={b.gradient[2]} />
          </linearGradient>
        ))}

        {/* Bar top gloss */}
        {bars.map((_, i) => (
          <linearGradient key={`g${i}`} id={`gloss${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </linearGradient>
        ))}

        {/* Drop shadow filter */}
        {bars.map((b, i) => (
          <filter key={`f${i}`} id={`shadow${i}`} x="-20%" y="-40%" width="140%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation={size * 0.02} floodColor={b.glow} floodOpacity="1" />
          </filter>
        ))}

        <clipPath id="iconClip">
          <rect x="0" y="0" width={size} height={size} rx={r} ry={r} />
        </clipPath>
      </defs>

      {/* Icon background */}
      <rect x="0" y="0" width={size} height={size} rx={r} ry={r} fill="url(#bg)" />
      {/* Sheen overlay */}
      <rect x="0" y="0" width={size} height={size} rx={r} ry={r} fill="url(#sheen)" />
      {/* Subtle border */}
      <rect x="0.5" y="0.5" width={size - 1} height={size - 1} rx={r} ry={r}
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {/* Bars */}
      {bars.map((b, i) => {
        const y = startY + i * (barH + gap);
        const x = size - paddingRight - b.width;
        return (
          <g key={i} filter={`url(#shadow${i})`}>
            <rect
              x={x} y={y}
              width={b.width} height={barH}
              rx={barRadius} ry={barRadius}
              fill={`url(#bar${i})`}
            />
            {/* Gloss overlay */}
            <rect
              x={x} y={y}
              width={b.width} height={barH}
              rx={barRadius} ry={barRadius}
              fill={`url(#gloss${i})`}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default function App() {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "48px",
      background: "radial-gradient(ellipse at 50% 40%, #1c2333 0%, #0d1117 100%)",
    }}>
      {/* Main icon with hover animation */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered ? "scale(1.06) translateY(-4px)" : "scale(1) translateY(0)",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          filter: hovered
            ? "drop-shadow(0 20px 48px rgba(30,188,214,0.25))"
            : "drop-shadow(0 8px 24px rgba(0,0,0,0.6))",
          cursor: "pointer",
        }}
      >
        <Icon size={256} />
      </div>

      {/* Size variants */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "28px" }}>
        {[180, 100, 60, 32].map((s) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <Icon size={s} />
            <span style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "11px",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}>
              {s}px
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

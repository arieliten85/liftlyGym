import Svg, {
  ClipPath,
  Defs,
  FeDropShadow,
  Filter,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

export const BrandIcon = ({ size = 256 }: { size?: number }) => {
  const r = size * 0.218;
  const gap = size * 0.07;
  const barH = size * 0.109;
  const barRadius = barH / 2;
  const paddingRight = size * 0.172;

  const bars = [
    {
      width: size * 0.406,
      gradientId: "bar0",
      glossId: "gloss0",
      shadowId: "shadow0",
      colors: ["#177d8f", "#1fa8bd", "#1a96ab"],
      glow: "rgba(29,158,179,0.5)",
    },
    {
      width: size * 0.594,
      gradientId: "bar1",
      glossId: "gloss1",
      shadowId: "shadow1",
      colors: ["#1ebcd6", "#35d4ec", "#28cce4"],
      glow: "rgba(53,212,236,0.55)",
    },
    {
      width: size * 0.672,
      gradientId: "bar2",
      glossId: "gloss2",
      shadowId: "shadow2",
      colors: ["#c2d8e2", "#eaf4f8", "#d2e6f0"],
      glow: "rgba(220,240,248,0.3)",
    },
  ];

  const totalH = bars.length * barH + (bars.length - 1) * gap;
  const startY = (size - totalH) / 2;

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <Defs>
        {/* Background */}
        <RadialGradient id="bg" cx="35%" cy="30%" r="70%">
          <Stop offset="0%" stopColor="#2e3a4a" />
          <Stop offset="55%" stopColor="#1a2330" />
          <Stop offset="100%" stopColor="#111820" />
        </RadialGradient>

        {/* Sheen */}
        <RadialGradient id="sheen" cx="50%" cy="15%" r="60%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
          <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </RadialGradient>

        {/* Bar gradients */}
        {bars.map((b) => (
          <LinearGradient key={b.gradientId} id={b.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%"   stopColor={b.colors[0]} />
            <Stop offset="55%"  stopColor={b.colors[1]} />
            <Stop offset="100%" stopColor={b.colors[2]} />
          </LinearGradient>
        ))}

        {/* Gloss overlays */}
        {bars.map((b) => (
          <LinearGradient key={b.glossId} id={b.glossId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%"   stopColor="#ffffff" stopOpacity="0.22" />
            <Stop offset="50%"  stopColor="#ffffff" stopOpacity="0" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </LinearGradient>
        ))}

        {/* Drop shadows */}
        {bars.map((b) => (
          <Filter key={b.shadowId} id={b.shadowId} x="-20%" y="-40%" width="140%" height="200%">
            <FeDropShadow
              dx="0"
              dy="2"
              stdDeviation={size * 0.02}
              floodColor={b.glow}
              floodOpacity="1"
            />
          </Filter>
        ))}

        <ClipPath id="iconClip">
          <Rect x="0" y="0" width={size} height={size} rx={r} ry={r} />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width={size} height={size} rx={r} ry={r} fill="url(#bg)" />
      {/* Sheen */}
      <Rect x="0" y="0" width={size} height={size} rx={r} ry={r} fill="url(#sheen)" />
      {/* Border */}
      <Rect
        x="0.5" y="0.5"
        width={size - 1} height={size - 1}
        rx={r} ry={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
      />

      {/* Bars */}
      {bars.map((b, i) => {
        const y = startY + i * (barH + gap);
        const x = size - paddingRight - b.width;
        return (
          <Svg key={b.gradientId} filter={`url(#${b.shadowId})`}>
            <Rect
              x={x} y={y}
              width={b.width} height={barH}
              rx={barRadius} ry={barRadius}
              fill={`url(#${b.gradientId})`}
            />
            <Rect
              x={x} y={y}
              width={b.width} height={barH}
              rx={barRadius} ry={barRadius}
              fill={`url(#${b.glossId})`}
            />
          </Svg>
        );
      })}
    </Svg>
  );
};

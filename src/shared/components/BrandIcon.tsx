import Svg, {
  Circle,
  ClipPath,
  Defs,
  FeDropShadow,
  Filter,
  G,
  LinearGradient,
  Path,
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
      colors: ["#0b5e6b", "#2bc5d6", "#1ca3b3"],
      glow: "rgba(43,197,214,0.6)",
    },
    {
      width: size * 0.594,
      gradientId: "bar1",
      glossId: "gloss1",
      shadowId: "shadow1",
      colors: ["#0d8a9c", "#4fe3fc", "#2ec9e0"],
      glow: "rgba(79,227,252,0.7)",
    },
    {
      width: size * 0.672,
      gradientId: "bar2",
      glossId: "gloss2",
      shadowId: "shadow2",
      colors: ["#8fb4cc", "#ffffff", "#b8d9ed"],
      glow: "rgba(255,255,255,0.5)",
    },
  ];

  const totalH = bars.length * barH + (bars.length - 1) * gap;
  const startY = (size - totalH) / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        {/* Background más vibrante */}
        <RadialGradient id="bg" cx="35%" cy="30%" r="80%">
          <Stop offset="0%" stopColor="#2c4559" />
          <Stop offset="40%" stopColor="#1e3142" />
          <Stop offset="80%" stopColor="#0f1a24" />
          <Stop offset="100%" stopColor="#0a1118" />
        </RadialGradient>

        {/* Sheen más notorio */}
        <RadialGradient id="sheen" cx="50%" cy="15%" r="70%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <Stop offset="60%" stopColor="#ffffff" stopOpacity="0.02" />
          <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </RadialGradient>

        {/* Bar gradients mejorados */}
        {bars.map((b) => (
          <LinearGradient
            key={b.gradientId}
            id={b.gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor={b.colors[0]} />
            <Stop offset="60%" stopColor={b.colors[1]} />
            <Stop offset="100%" stopColor={b.colors[2]} />
          </LinearGradient>
        ))}

        {/* Gloss overlays más definidos */}
        {bars.map((b) => (
          <LinearGradient
            key={b.glossId}
            id={b.glossId}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <Stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <Stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </LinearGradient>
        ))}

        {/* Drop shadows más intensos */}
        {bars.map((b) => (
          <Filter
            key={b.shadowId}
            id={b.shadowId}
            x="-25%"
            y="-50%"
            width="150%"
            height="200%"
          >
            <FeDropShadow
              dx="0"
              dy="3"
              stdDeviation={size * 0.025}
              floodColor={b.glow}
              floodOpacity="1"
            />
          </Filter>
        ))}

        {/* Clip path con bordes más suaves */}
        <ClipPath id="iconClip">
          <Rect x="0" y="0" width={size} height={size} rx={r} ry={r} />
        </ClipPath>
      </Defs>

      {/* Background con brillo adicional */}
      <Rect
        x="0"
        y="0"
        width={size}
        height={size}
        rx={r}
        ry={r}
        fill="url(#bg)"
      />

      {/* Sheen mejorado */}
      <Rect
        x="0"
        y="0"
        width={size}
        height={size}
        rx={r}
        ry={r}
        fill="url(#sheen)"
      />

      {/* Borde más definido */}
      <Rect
        x="0.5"
        y="0.5"
        width={size - 1}
        height={size - 1}
        rx={r}
        ry={r}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />

      {/* Bars con mejor contraste */}
      {bars.map((b, i) => {
        const y = startY + i * (barH + gap);
        const x = size - paddingRight - b.width;
        return (
          <Svg key={b.gradientId} filter={`url(#${b.shadowId})`}>
            <Rect
              x={x}
              y={y}
              width={b.width}
              height={barH}
              rx={barRadius}
              ry={barRadius}
              fill={`url(#${b.gradientId})`}
            />
            <Rect
              x={x}
              y={y}
              width={b.width}
              height={barH}
              rx={barRadius}
              ry={barRadius}
              fill={`url(#${b.glossId})`}
            />
          </Svg>
        );
      })}
    </Svg>
  );
};

export const LiftlyIcon = ({ size = 32 }: { size?: number }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {/* Círculo principal - Teal vibrante */}
      <Circle
        cx="16"
        cy="16"
        r="14"
        fill="#2ECFBE"
        stroke="#1A9E90"
        strokeWidth="1.5"
      />

      {/* L blanca */}
      <Path
        d="M11 10 L11 22 L20 22"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Estrellas decorativas en teal más claro */}
      <G fill="#7FE9DB" opacity="0.8">
        <Circle cx="6" cy="6" r="1.2" />
        <Circle cx="26" cy="8" r="1" />
        <Circle cx="24" cy="26" r="1.2" />
        <Circle cx="8" cy="24" r="1" />
      </G>

      {/* Puntos brillantes en blanco suave */}
      <G fill="white" opacity="0.5">
        <Circle cx="12" cy="12" r="1" />
        <Circle cx="20" cy="20" r="1" />
      </G>
    </Svg>
  );
};

import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface ParticleBackgroundProps {
  isDark: boolean;
  glowAlpha: string;
}

export function ParticleBackground({
  isDark,
  glowAlpha,
}: ParticleBackgroundProps) {
  if (!isDark) {
    return (
      <>
        <View style={[styles.topGlow, { backgroundColor: glowAlpha }]} />
        <View style={[styles.bottomGlow, { backgroundColor: glowAlpha }]} />
      </>
    );
  }

  return (
    <>
      {[...Array(20)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.particle,
            {
              top: `${(i * 17 + 3) % 92}%` as any,
              left: `${(i * 29 + 7) % 88}%` as any,
              opacity: 0.07 + (i % 5) * 0.04,
              width: i % 4 === 0 ? 3 : 2,
              height: i % 4 === 0 ? 3 : 2,
            },
          ]}
        />
      ))}
      <View style={[styles.topGlow, { backgroundColor: glowAlpha }]} />
      <View style={[styles.bottomGlow, { backgroundColor: glowAlpha }]} />
    </>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    borderRadius: 2,
    backgroundColor: "#2ECFBE",
  },
  topGlow: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    top: -width * 0.3,
    alignSelf: "center",
    pointerEvents: "none",
  },
  bottomGlow: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    bottom: height * 0.1,
    left: -width * 0.15,
    pointerEvents: "none",
  },
});

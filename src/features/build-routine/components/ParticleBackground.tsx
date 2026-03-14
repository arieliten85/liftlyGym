// shared/components/ParticleBackground.tsx
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface ParticleBackgroundProps {
  isDark: boolean;
  glowAlpha: string;
}

export function ParticleBackground({
  isDark,
  glowAlpha,
}: ParticleBackgroundProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de rotación para los discos
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      }),
    ).start();

    // Animación de pulso para los discos
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const pulse = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Discos de peso giratorios */}
      <Animated.View
        style={[
          styles.disk,
          {
            top: "10%",
            right: "-5%",
            width: 200,
            height: 200,
            borderColor: "#2ECFBE",
            opacity: isDark ? 0.15 : 0.08,
            transform: [{ rotate: spin }, { scale: pulse }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.disk,
          {
            bottom: "5%",
            left: "-10%",
            width: 250,
            height: 250,
            borderColor: "#2ECFBE",
            opacity: isDark ? 0.12 : 0.06,
            transform: [{ rotate: spin }, { scale: pulse }],
          },
        ]}
      />

      {/* Discos sólidos pequeños */}
      <View
        style={[
          styles.solidDisk,
          {
            top: "30%",
            left: "5%",
            width: 40,
            height: 40,
            backgroundColor: "#2ECFBE",
            opacity: isDark ? 0.08 : 0.04,
          },
        ]}
      />

      <View
        style={[
          styles.solidDisk,
          {
            bottom: "25%",
            right: "8%",
            width: 60,
            height: 60,
            backgroundColor: "#2ECFBE",
            opacity: isDark ? 0.1 : 0.05,
          },
        ]}
      />

      {/* Barras (simulando barra de pesas) */}
      <View
        style={[
          styles.bar,
          {
            top: "50%",
            left: "-10%",
            width: "40%",
            height: 4,
            backgroundColor: "#2ECFBE",
            opacity: isDark ? 0.12 : 0.06,
            transform: [{ rotate: "25deg" }],
          },
        ]}
      />

      <View
        style={[
          styles.bar,
          {
            bottom: "15%",
            right: "-5%",
            width: "35%",
            height: 4,
            backgroundColor: "#2ECFBE",
            opacity: isDark ? 0.1 : 0.05,
            transform: [{ rotate: "-15deg" }],
          },
        ]}
      />

      {/* Brillo superior e inferior (los de siempre) */}
      <View style={[styles.topGlow, { backgroundColor: glowAlpha }]} />
      <View style={[styles.bottomGlow, { backgroundColor: glowAlpha }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  disk: {
    position: "absolute",
    borderRadius: 1000,
    borderWidth: 1,
  },
  solidDisk: {
    position: "absolute",
    borderRadius: 1000,
  },
  bar: {
    position: "absolute",
  },
  topGlow: {
    position: "absolute",
    width: "80%",
    height: "40%",
    borderRadius: 1000,
    top: "-20%",
    alignSelf: "center",
  },
  bottomGlow: {
    position: "absolute",
    width: "50%",
    height: "25%",
    borderRadius: 500,
    bottom: "10%",
    left: "-15%",
  },
});

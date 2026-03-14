import { useRoutineStore } from "@/store/routine/useRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useRouter } from "expo-router";
import { useEffect } from "react";

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ParticleBackground } from "../build-routine/components/ParticleBackground";

export default function GeneratingRoutineScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  const error = useRoutineStore((s) => s.error);
  const isLoading = useRoutineStore((s) => s.isLoading);

  const bg = theme.colors.background;
  const primary = theme.colors.primary;
  const text = theme.colors.text;
  const secondaryText = isDark ? "#8AA4A0" : "#6B7C78";

  const glowAlpha = isDark ? "rgba(46,207,190,0.15)" : "rgba(46,207,190,0.08)";

  useEffect(() => {
    if (!isLoading && !error) {
      router.replace("/routine");
    }
  }, [isLoading, error]);

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <Text style={styles.errorTitle}>Ups!</Text>
        <Text style={[styles.errorText, { color: text }]}>{error}</Text>
        <TouchableOpacity
          onPress={() => {
            useRoutineStore.getState().clearRoutine();
            router.back();
          }}
          style={{ marginTop: 24 }}
        >
          <Text style={[styles.cancel, { color: primary }]}>
            Volver a intentar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <ParticleBackground isDark={isDark} glowAlpha={glowAlpha} />
      </View>

      {/* Logo */}
      <Image
        source={require("../../../assets/loading/logo_loading.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Texto */}
      <Text style={[styles.title, { color: primary }]}>
        Estamos generando tu{"\n"}rutina personalizada
      </Text>

      <Text style={[styles.subtitle, { color: secondaryText }]}>
        Analizando tus datos para el plan perfecto
      </Text>

      {/* Loader */}
      <ActivityIndicator size="large" color={primary} style={styles.loader} />

      {/* Cancel */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.cancel, { color: secondaryText }]}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },

  loader: {
    marginBottom: 40,
  },

  cancel: {
    fontSize: 16,
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "red",
  },

  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});

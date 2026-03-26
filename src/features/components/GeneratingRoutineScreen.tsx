import { RoutineService } from "@/services/routineService";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useRoutineStore } from "@/store/routine/useRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ParticleBackground } from "../build-routine/components/ParticleBackground";

const routineService = new RoutineService();

export default function GeneratingRoutineScreen() {
  const { theme, isDark } = useAppTheme();
  const hasStarted = useRef(false);

  const getQuickPayload = useBuildRoutineStore((s) => s.getQuickPayload);
  const reset = useBuildRoutineStore((s) => s.reset);

  const setLoading = useRoutineStore((s) => s.setLoading);
  const setRoutine = useRoutineStore((s) => s.setRoutine);
  const setError = useRoutineStore((s) => s.setError);
  const error = useRoutineStore((s) => s.error);

  const bg = theme.background;
  const primary = theme.primary;
  const text = theme.text;
  const secondaryText = isDark ? "#8AA4A0" : "#6B7C78";
  const glowAlpha = isDark ? "rgba(46,207,190,0.15)" : "rgba(46,207,190,0.08)";

  useEffect(() => {
    // useRef evita que se llame dos veces en StrictMode
    if (hasStarted.current) return;
    hasStarted.current = true;

    const generate = async () => {
      const payload = getQuickPayload();

      if (!payload) {
        // No hay payload — el usuario llegó acá sin pasar por el flujo
        router.replace("/(app)/(tabs)/rutinas");
        return;
      }

      setLoading(true);

      try {
        const saved = await routineService.generateRoutineOnboarding(payload);

        setRoutine({
          routineId: saved.routineId,
          exercises: saved.exercises,
          goal: saved.goal,
          experience: saved.experience,
          routineName: saved.name,
        });

        // Limpiar el store de onboarding — ya cumplió su función
        reset();

        // replace borra todo el historial de (onboarding)
        router.replace("/(app)/(tabs)/rutinas");
      } catch (e: any) {
        setError(e?.message ?? "Error generando la rutina");
        setLoading(false);
      }
    };

    generate();
  }, []);

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <Text style={styles.errorTitle}>Ups!</Text>
        <Text style={[styles.errorText, { color: text }]}>{error}</Text>
        <TouchableOpacity
          onPress={() => {
            setError("");
            hasStarted.current = false;
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

      <Image
        source={require("../../../assets/loading/logo_loading.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: primary }]}>
        Estamos generando tu{"\n"}rutina personalizada
      </Text>

      <Text style={[styles.subtitle, { color: secondaryText }]}>
        Analizando tus datos para el plan perfecto
      </Text>

      <ActivityIndicator size="large" color={primary} style={styles.loader} />

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

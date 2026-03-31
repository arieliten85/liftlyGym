import { RoutineService } from "@/services/routineService";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useNotificationStore } from "@/store/notification/usenotificationstore";
import { useRoutineStore } from "@/store/routine/useRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { Routine } from "@/types/routine/session.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RoutineCard } from "../components/RoutineCard";

const routineService = new RoutineService();

export default function RoutineScreen() {
  const { theme, isDark } = useAppTheme();
  const c = theme;
  const { setRoutine } = useRoutineStore();
  const setMode = useBuildRoutineStore((s) => s.setMode);
  const [selectedMode, setSelectedMode] = React.useState<"quick" | "custom">(
    "quick",
  );

  const bg = isDark ? "#070B12" : c.background;
  const cardBg = isDark ? "#0E1219" : c.card;
  const subColor = isDark ? "#4A5568" : c.textSecondary;
  const borderCol = isDark ? "#141922" : c.border;
  const TEAL = c.primary;

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;
  const modesFade = useRef(new Animated.Value(0)).current;
  const modesSlide = useRef(new Animated.Value(16)).current;

  const [routines, setRoutines] = React.useState<Routine[]>([]);
  const [loading, setLoading] = React.useState(true);

  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(modesFade, {
        toValue: 1,
        duration: 400,
        delay: 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(modesSlide, {
        toValue: 0,
        duration: 380,
        delay: 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await routineService.getUserRoutines();
        setRoutines(data);
      } catch (error) {
        console.error("Error loading routines:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  const handleDeleteRoutine = async (id: string) => {
    try {
      await routineService.deleteRoutineById(id);
      setRoutines((prev) => prev.filter((r) => r.routineId !== id));
      await fetchNotifications();
    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Eliminar rutina", "¿Seguro que querés eliminarla?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => handleDeleteRoutine(id),
      },
    ]);
  };

  const handleStartRoutine = (routine: Routine) => {
    setRoutine({
      exercises: routine.exercises,
      goal: routine.goal,
      experience: routine.experience,
      routineName: routine.name,
      routineId: routine.routineId,
    });
    router.push("/(app)/routine?from=tabs");
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: c.text }}>Cargando rutinas...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: bg }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Crear nueva rutina */}
        <Animated.View
          style={[
            styles.createSection,
            { opacity: modesFade, transform: [{ translateY: modesSlide }] },
          ]}
        >
          <Text style={[styles.createTitle, { color: c.text }]}>
            Crear nueva rutina
          </Text>
          <Text style={[styles.createSubtitle, { color: subColor }]}>
            Elegí cómo querés empezar hoy
          </Text>

          <View style={styles.modesRow}>
            {/* Modo Rápido */}
            <TouchableOpacity
              style={[
                styles.modeCard,
                selectedMode === "quick" && styles.modeCardActive,
                { borderColor: selectedMode === "quick" ? TEAL : borderCol },
              ]}
              activeOpacity={0.82}
              onPress={() => {
                setSelectedMode("quick");
                setMode("quick");
                router.push("/(onboarding)/(build-routine)/goals?from=tabs");
              }}
            >
              <View style={[styles.modeIconWrap, { backgroundColor: TEAL }]}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={22}
                  color="#fff"
                />
              </View>
              <Text style={[styles.modeTitle, { color: c.text }]}>
                Modo Rápido
              </Text>
              <Text style={[styles.modeDesc, { color: subColor }]}>
                Plan generado por IA según tus objetivos
              </Text>
            </TouchableOpacity>

            {/* Modo Custom */}
            <TouchableOpacity
              style={[
                styles.modeCard,
                selectedMode === "custom" && styles.modeCardActive,
                {
                  backgroundColor:
                    selectedMode === "custom" ? "#0D2B2B" : cardBg,
                  borderColor: selectedMode === "custom" ? TEAL : borderCol,
                },
              ]}
              activeOpacity={0.82}
              onPress={() => {
                setSelectedMode("custom");
                setMode("custom");
                router.push("/(onboarding)/(build-routine)/goals?from=tabs");
              }}
            >
              <View
                style={[
                  styles.modeIconWrap,
                  {
                    backgroundColor: "transparent",
                    borderWidth: 1.5,
                    borderColor: borderCol,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="pencil-ruler"
                  size={22}
                  color={subColor}
                />
              </View>
              <Text style={[styles.modeTitle, { color: c.text }]}>
                Modo Custom
              </Text>
              <Text style={[styles.modeDesc, { color: subColor }]}>
                Armá tu rutina desde cero
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Lista de rutinas */}
        <View style={styles.routinesSection}>
          <Animated.View
            style={[
              styles.routinesHeader,
              { opacity: modesFade, transform: [{ translateY: modesSlide }] },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: c.text }]}>
              Mis Rutinas
            </Text>
          </Animated.View>

          {routines.length === 0 ? (
            <Text style={{ color: subColor, fontSize: 14 }}>
              Todavía no tenés rutinas creadas
            </Text>
          ) : (
            routines.map((routine, index) => (
              <RoutineCard
                key={routine.routineId ?? index}
                routine={routine}
                accentColor={TEAL}
                cardBg={cardBg}
                borderColor={borderCol}
                textColor={c.text}
                subColor={subColor}
                index={index}
                onDelete={confirmDelete}
                onStart={handleStartRoutine}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 22, gap: 24, paddingBottom: 48 },
  header: { paddingTop: 4 },
  screenTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.8,
    lineHeight: 32,
  },
  createSection: { gap: 10 },
  createTitle: { fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  createSubtitle: { fontSize: 13, fontWeight: "500", marginTop: -4 },
  modesRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  modeCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    gap: 8,
  },
  modeCardActive: { backgroundColor: "#0D2B2B" },
  modeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modeTitle: { fontSize: 14, fontWeight: "800", letterSpacing: -0.3 },
  modeDesc: { fontSize: 11, fontWeight: "500", lineHeight: 15 },
  routinesSection: { gap: 14 },
  routinesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
});

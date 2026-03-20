import { RoutineService } from "@/services/routineService";
import { useNotificationStore } from "@/store/notification/usenotificationstore";
import { useRoutineStore } from "@/store/routine/useRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { Routine } from "@/types/routine/session";
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

const routineService = new RoutineService();

function estimateDuration(exercises: Routine["exercises"]): number {
  const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
  const avgRestMin =
    exercises.reduce((acc, e) => acc + e.restSeconds, 0) /
    exercises.length /
    60;
  return Math.round(totalSets * (1.5 + avgRestMin));
}

const MUSCLE_KEYWORDS: [string, string][] = [
  ["squat", "Quads"],
  ["deadlift", "Isquios"],
  ["press", "Pecho"],
  ["row", "Espalda"],
  ["remo", "Espalda"],
  ["curl", "Bíceps"],
  ["pushdown", "Tríceps"],
  ["lateral", "Hombros"],
  ["ohp", "Hombros"],
  ["shoulder", "Hombros"],
  ["jalon", "Espalda"],
  ["dominadas", "Espalda"],
  ["calf", "Pantorrillas"],
  ["lunge", "Quads"],
  ["hip", "Glúteos"],
  ["plank", "Core"],
  ["push", "Pecho"],
  ["fly", "Pecho"],
];

function inferMuscles(exercises: Routine["exercises"]): string[] {
  const found = new Set<string>();
  for (const ex of exercises) {
    const lower = ex.name.toLowerCase();
    for (const [key, muscle] of MUSCLE_KEYWORDS) {
      if (lower.includes(key)) found.add(muscle);
    }
  }
  return found.size > 0 ? Array.from(found).slice(0, 3) : ["Cuerpo completo"];
}

const COVER_BY_GOAL: Record<string, string> = {
  strength: "#1B2E1B",
  hypertrophy: "#1B1B30",
  general_fitness: "#2A2010",
  weight_loss: "#2A1010",
  endurance: "#101828",
};

const EXP_LABEL: Record<string, string> = {
  beginner: "PRINCIPIANTE",
  intermediate: "INTERMEDIO",
  advanced: "AVANZADO",
};

const EXP_COLOR: Record<string, string> = {
  beginner: "#22C55E",
  intermediate: "#F59E0B",
  advanced: "#3B82F6",
};

interface RoutineCardProps {
  routine: Routine;
  accentColor: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  subColor: string;
  index: number;
  onDelete: (id: string) => void;
  onStart: (routine: Routine) => void;
}

function RoutineCard({
  routine,
  accentColor,
  cardBg,
  borderColor,
  textColor,
  subColor,
  index,
  onDelete,
  onStart,
}: RoutineCardProps) {
  const expColor = EXP_COLOR[routine.experience] ?? "#6B7280";
  const expLabel =
    EXP_LABEL[routine.experience] ?? routine.experience.toUpperCase();
  const coverColor = COVER_BY_GOAL[routine.goal] ?? "#1A1A1A";
  const muscles = inferMuscles(routine.exercises);
  const duration = estimateDuration(routine.exercises);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        delay: 120 + index * 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 360,
        delay: 120 + index * 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        rc.card,
        { backgroundColor: cardBg, borderColor },
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Botón eliminar */}
      {routine.routineId && (
        <TouchableOpacity
          onPress={() => onDelete(routine.routineId!)}
          style={rc.deleteButton}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={18}
            color="#EF4444"
          />
        </TouchableOpacity>
      )}

      {/* Cover */}
      <View style={[rc.cover, { backgroundColor: coverColor }]}>
        <View style={rc.coverOverlay} />
        <View style={[rc.expBadge, { backgroundColor: expColor }]}>
          <Text style={rc.expText}>{expLabel}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={rc.body}>
        <View style={rc.bodyTop}>
          <View style={{ flex: 1 }}>
            <Text style={[rc.name, { color: textColor }]} numberOfLines={1}>
              {routine.name}
            </Text>
            <Text style={[rc.muscles, { color: subColor }]} numberOfLines={1}>
              {muscles.join(", ")}
            </Text>
          </View>
          <View style={rc.metaRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={12}
              color={subColor}
            />
            <Text style={[rc.metaText, { color: subColor }]}>
              {duration} min
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[rc.cta, { backgroundColor: accentColor }]}
          activeOpacity={0.8}
          onPress={() => onStart(routine)}
        >
          <MaterialCommunityIcons name="play" size={14} color="#fff" />
          <Text style={rc.ctaText}>Iniciar entrenamiento</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function RutinasScreen() {
  const { theme, isDark } = useAppTheme();
  const c = theme;
  const { setRoutine } = useRoutineStore();

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

  // Carga la rutina en el store y navega a la pantalla de ejecución
  const handleStartRoutine = (routine: Routine) => {
    setRoutine({
      exercises: routine.exercises,
      goal: routine.goal,
      experience: routine.experience,
      routineName: routine.name,
      routineId: routine.routineId,
    });
    router.push("/routine");
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
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: headerFade, transform: [{ translateY: headerSlide }] },
          ]}
        >
          <Text style={[styles.screenTitle, { color: c.text }]}>
            Mis Rutinas
          </Text>
        </Animated.View>

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
            <TouchableOpacity
              style={[
                styles.modeCard,
                styles.modeCardActive,
                { borderColor: TEAL },
              ]}
              activeOpacity={0.82}
              onPress={() => router.push("/goals")}
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

            <TouchableOpacity
              style={[
                styles.modeCard,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
              activeOpacity={0.82}
              onPress={() => {}}
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

const rc = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  cover: { height: 130, justifyContent: "flex-end", padding: 12 },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  expBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.8,
  },
  body: { padding: 16, gap: 12 },
  bodyTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  muscles: { fontSize: 12, fontWeight: "500" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  metaText: { fontSize: 12, fontWeight: "600" },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.2,
  },
  deleteButton: { position: "absolute", top: 10, right: 10, zIndex: 10 },
});

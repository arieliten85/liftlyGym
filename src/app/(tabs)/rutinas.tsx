import { useAppTheme } from "@/theme/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types (reales) ───────────────────────────────────────────────────────────

export interface RoutineExercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  weight?: number;
}

export interface SetLog {
  setNumber: number;
  repsCompleted: number | null;
  weight: number | null;
  skipped: boolean;
}

export interface ExerciseProgress {
  exerciseIndex: number;
  completed: boolean;
  currentSet: number;
  totalSets: number;
  setLogs: SetLog[];
  displayValues: {
    reps: string;
    weight: number;
    restSeconds: number;
    sets: number;
  };
}

export interface RoutineSession {
  exercises: ExerciseProgress[];
  startedAt: string;
}

export interface Routine {
  routineId?: string;
  name: string;
  goal: string;
  experience: string;
  exercises: RoutineExercise[];
  createdAt: string;
  totalExercises: number;
  totalSets: number;
}

export interface CompletedRoutinePayload {
  routineId?: string;
  startedAt: string;
  completedAt: string;
  wasAbandoned: boolean;
  feedback: {
    intensity: number | null;
    energy: number | null;
    painLevel: number | null;
    comment: string;
  };
  exercises: {
    name: string;
    setLogs: SetLog[];
  }[];
}

// ─── UI helpers (solo para el mock, no viajan al backend) ─────────────────────

function estimateDuration(exercises: RoutineExercise[]): number {
  const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
  const avgRestMin =
    exercises.reduce((acc, e) => acc + e.restSeconds, 0) /
    exercises.length /
    60;
  return Math.round(totalSets * (1.5 + avgRestMin));
}

const MUSCLE_KEYWORDS: [string, string][] = [
  ["squat", "Quads"],
  ["deadlift", "Hamstrings"],
  ["press", "Chest"],
  ["row", "Back"],
  ["curl", "Bíceps"],
  ["pushdown", "Tríceps"],
  ["lateral", "Hombros"],
  ["ohp", "Hombros"],
  ["shoulder", "Hombros"],
  ["calf", "Pantorrillas"],
  ["lunge", "Quads"],
  ["hip", "Glúteos"],
  ["plank", "Core"],
  ["push up", "Pecho"],
  ["fly", "Pecho"],
];

function inferMuscles(exercises: RoutineExercise[]): string[] {
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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ROUTINES: Routine[] = [
  {
    routineId: "mock-001",
    name: "Leg Day Intense",
    goal: "strength",
    experience: "advanced",
    createdAt: new Date().toISOString(),
    totalExercises: 7,
    totalSets: 24,
    exercises: [
      {
        name: "Back Squat",
        sets: 4,
        reps: "6-8",
        restSeconds: 120,
        weight: 100,
      },
      {
        name: "Romanian Deadlift",
        sets: 4,
        reps: "8-10",
        restSeconds: 90,
        weight: 80,
      },
      {
        name: "Leg Press",
        sets: 3,
        reps: "12-15",
        restSeconds: 90,
        weight: 160,
      },
      {
        name: "Bulgarian Split Squat",
        sets: 3,
        reps: "10-12",
        restSeconds: 75,
        weight: 30,
      },
      { name: "Leg Extension", sets: 3, reps: "15", restSeconds: 60 },
      { name: "Lying Leg Curl", sets: 3, reps: "12-15", restSeconds: 60 },
      { name: "Standing Calf Raise", sets: 4, reps: "20", restSeconds: 45 },
    ],
  },
  {
    routineId: "mock-002",
    name: "Upper Body Push",
    goal: "hypertrophy",
    experience: "intermediate",
    createdAt: new Date().toISOString(),
    totalExercises: 6,
    totalSets: 20,
    exercises: [
      {
        name: "Barbell Bench Press",
        sets: 4,
        reps: "8-10",
        restSeconds: 90,
        weight: 80,
      },
      {
        name: "Incline DB Press",
        sets: 3,
        reps: "10-12",
        restSeconds: 75,
        weight: 28,
      },
      { name: "Cable Fly", sets: 3, reps: "12-15", restSeconds: 60 },
      { name: "OHP", sets: 4, reps: "8-10", restSeconds: 90, weight: 55 },
      { name: "Lateral Raise", sets: 3, reps: "15-20", restSeconds: 45 },
      { name: "Tricep Pushdown", sets: 3, reps: "12-15", restSeconds: 60 },
    ],
  },
  {
    routineId: "mock-003",
    name: "Full Body Functional",
    goal: "general_fitness",
    experience: "beginner",
    createdAt: new Date().toISOString(),
    totalExercises: 5,
    totalSets: 15,
    exercises: [
      {
        name: "Goblet Squat",
        sets: 3,
        reps: "12",
        restSeconds: 60,
        weight: 16,
      },
      { name: "Push Up", sets: 3, reps: "10-15", restSeconds: 60 },
      {
        name: "Dumbbell Row",
        sets: 3,
        reps: "10-12",
        restSeconds: 60,
        weight: 18,
      },
      { name: "Hip Thrust", sets: 3, reps: "15", restSeconds: 60, weight: 40 },
      { name: "Plank", sets: 3, reps: "30s", restSeconds: 45 },
    ],
  },
];

// ─── Routine Card ─────────────────────────────────────────────────────────────

interface RoutineCardProps {
  routine: Routine;
  accentColor: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  subColor: string;
  index: number;
}

function RoutineCard({
  routine,
  accentColor,
  cardBg,
  borderColor,
  textColor,
  subColor,
  index,
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
          onPress={() => {}}
        >
          <MaterialCommunityIcons name="play" size={14} color="#fff" />
          <Text style={rc.ctaText}>Iniciar entrenamiento</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function RutinasScreen() {
  const { theme, isDark } = useAppTheme();
  const c = theme.colors;

  const bg = isDark ? "#070B12" : c.background;
  const cardBg = isDark ? "#0E1219" : c.card;
  const subColor = isDark ? "#4A5568" : c.textSecondary;
  const borderCol = isDark ? "#141922" : c.border;
  const TEAL = c.primary;

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;
  const modesFade = useRef(new Animated.Value(0)).current;
  const modesSlide = useRef(new Animated.Value(16)).current;

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

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View
          style={[
            s.header,
            { opacity: headerFade, transform: [{ translateY: headerSlide }] },
          ]}
        >
          <Text style={[s.screenTitle, { color: c.text }]}>Mis Rutinas</Text>
        </Animated.View>

        {/* ── Crear nueva rutina ── */}
        <Animated.View
          style={[
            s.createSection,
            { opacity: modesFade, transform: [{ translateY: modesSlide }] },
          ]}
        >
          <Text style={[s.createTitle, { color: c.text }]}>
            Crear nueva rutina
          </Text>
          <Text style={[s.createSubtitle, { color: subColor }]}>
            Elegí cómo querés empezar hoy
          </Text>

          <View style={s.modesRow}>
            {/* Modo Rápido */}
            <TouchableOpacity
              style={[s.modeCard, s.modeCardActive, { borderColor: TEAL }]}
              activeOpacity={0.82}
              onPress={() => router.push("/goals")}
            >
              <View style={[s.modeIconWrap, { backgroundColor: TEAL }]}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={22}
                  color="#fff"
                />
              </View>
              <Text style={[s.modeTitle, { color: c.text }]}>Modo Rápido</Text>
              <Text style={[s.modeDesc, { color: subColor }]}>
                Plan generado por IA según tus objetivos
              </Text>
            </TouchableOpacity>

            {/* Modo Custom */}
            <TouchableOpacity
              style={[
                s.modeCard,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
              activeOpacity={0.82}
              onPress={() => {}}
            >
              <View
                style={[
                  s.modeIconWrap,
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
              <Text style={[s.modeTitle, { color: c.text }]}>Modo Custom</Text>
              <Text style={[s.modeDesc, { color: subColor }]}>
                Armá tu rutina desde cero
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Lista de rutinas ── */}
        <View style={s.routinesSection}>
          <Animated.View
            style={[
              s.routinesHeader,
              { opacity: modesFade, transform: [{ translateY: modesSlide }] },
            ]}
          >
            <Text style={[s.sectionTitle, { color: c.text }]}>Mis Rutinas</Text>
            <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
              <Text style={[s.viewAll, { color: TEAL }]}>Ver todo</Text>
            </TouchableOpacity>
          </Animated.View>

          {MOCK_ROUTINES.map((routine, index) => (
            <RoutineCard
              key={routine.routineId ?? index}
              routine={routine}
              accentColor={TEAL}
              cardBg={cardBg}
              borderColor={borderCol}
              textColor={c.text}
              subColor={subColor}
              index={index}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
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
  createTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  createSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: -4,
  },
  modesRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  modeCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    gap: 8,
  },
  modeCardActive: {
    backgroundColor: "#0D2B2B",
  },
  modeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  modeDesc: {
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 15,
  },

  routinesSection: { gap: 14 },
  routinesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "700",
  },
});

const rc = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  cover: {
    height: 130,
    justifyContent: "flex-end",
    padding: 12,
  },
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
  body: {
    padding: 16,
    gap: 12,
  },
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
  muscles: {
    fontSize: 12,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "600",
  },
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
});

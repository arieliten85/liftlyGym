import { useUserStore } from "@/features/auth/store/userStore";
import { useAppTheme } from "@/theme/ThemeProvider";
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
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  experience: "beginner" | "intermediate" | "advanced";
  exercises: RoutineExercise[];
  createdAt: string;
  totalExercises: number;
  totalSets: number;
  durationMinutes: number;
  muscleGroups: string[];
  coverColor: string; // gradient color for mock cover
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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ROUTINES: Routine[] = [
  {
    routineId: "mock-001",
    name: "Leg Day Intense",
    goal: "strength",
    experience: "advanced",
    durationMinutes: 65,
    muscleGroups: ["Quads", "Hamstrings", "Calves"],
    coverColor: "#1A2A1A",
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
    durationMinutes: 45,
    muscleGroups: ["Chest", "Shoulders", "Triceps"],
    coverColor: "#1A1A2A",
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
    durationMinutes: 40,
    muscleGroups: ["Full Body"],
    coverColor: "#1A1A14",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EXPERIENCE_LABELS: Record<Routine["experience"], string> = {
  beginner: "BEGINNER",
  intermediate: "INTERMEDIATE",
  advanced: "ADVANCED",
};

const EXPERIENCE_COLORS: Record<Routine["experience"], string> = {
  beginner: "#22C55E",
  intermediate: "#F59E0B",
  advanced: "#3B82F6",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MenuRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  accentColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  destructive?: boolean;
  showChevron?: boolean;
}

function MenuRow({
  icon,
  label,
  onPress,
  accentColor,
  textColor,
  bgColor,
  borderColor,
  destructive = false,
  showChevron = true,
}: MenuRowProps) {
  const color = destructive ? "#EF4444" : accentColor;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.72}
      style={[r.row, { backgroundColor: bgColor, borderColor }]}
    >
      <View style={[r.rowIcon, { backgroundColor: color + "14" }]}>
        <MaterialCommunityIcons name={icon as any} size={18} color={color} />
      </View>
      <Text
        style={[r.rowLabel, { color: destructive ? "#EF4444" : textColor }]}
      >
        {label}
      </Text>
      {showChevron && !destructive && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={18}
          color={borderColor}
        />
      )}
    </TouchableOpacity>
  );
}

interface RoutineCardProps {
  routine: Routine;
  accentColor: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  subColor: string;
}

function RoutineCard({
  routine,
  accentColor,
  cardBg,
  borderColor,
  textColor,
  subColor,
}: RoutineCardProps) {
  const expColor = EXPERIENCE_COLORS[routine.experience];
  const expLabel = EXPERIENCE_LABELS[routine.experience];

  return (
    <View style={[rc.card, { backgroundColor: cardBg, borderColor }]}>
      {/* Cover */}
      <View style={[rc.cover, { backgroundColor: routine.coverColor }]}>
        {/* Gradient overlay */}
        <View style={rc.coverOverlay} />
        {/* Experience badge */}
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
              {routine.muscleGroups.join(", ")}
            </Text>
          </View>
          <View style={rc.duration}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={12}
              color={subColor}
            />
            <Text style={[rc.durationText, { color: subColor }]}>
              {routine.durationMinutes} min
            </Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[rc.cta, { backgroundColor: accentColor }]}
          activeOpacity={0.8}
          onPress={() => {}}
        >
          <MaterialCommunityIcons name="play" size={14} color="#fff" />
          <Text style={rc.ctaText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PerfilScreen() {
  const { theme, isDark } = useAppTheme();
  const c = theme.colors;

  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const bg = isDark ? "#070B12" : c.background;
  const cardBg = isDark ? "#0E1219" : c.card;
  const subColor = isDark ? "#4A5568" : c.textSecondary;
  const borderCol = isDark ? "#141922" : c.border;
  const TEAL = c.primary;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que querés cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

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
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={[s.title, { color: c.text }]}>Perfil</Text>
        </Animated.View>

        {/* ── Tarjeta de usuario ── */}
        <Animated.View
          style={[
            s.profileCard,
            { backgroundColor: cardBg, borderColor: borderCol },
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View
            style={[
              s.avatar,
              { backgroundColor: TEAL + "1A", borderColor: TEAL + "30" },
            ]}
          >
            <Text style={[s.avatarText, { color: TEAL }]}>{initials}</Text>
          </View>

          <View style={s.profileInfo}>
            <Text style={[s.profileName, { color: c.text }]} numberOfLines={1}>
              {user?.name ?? "—"}
            </Text>
            <Text
              style={[s.profileEmail, { color: subColor }]}
              numberOfLines={1}
            >
              {user?.email ?? "—"}
            </Text>
          </View>

          <View
            style={[
              s.activeBadge,
              { backgroundColor: TEAL + "14", borderColor: TEAL + "28" },
            ]}
          >
            <View style={[s.activeDot, { backgroundColor: TEAL }]} />
            <Text style={[s.activeBadgeText, { color: TEAL }]}>Activo</Text>
          </View>
        </Animated.View>

        {/* ── Crear nueva rutina ── */}
        <Animated.View style={[s.section, { opacity: fadeAnim }]}>
          <Text style={[s.sectionTitle, { color: c.text }]}>
            Crear nueva rutina
          </Text>
          <Text style={[s.sectionSubtitle, { color: subColor }]}>
            Elegí cómo querés empezar hoy
          </Text>

          <View style={s.modesRow}>
            {/* Modo Rápido */}
            <TouchableOpacity
              style={[s.modeCard, s.modeCardActive, { borderColor: TEAL }]}
              activeOpacity={0.85}
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

            {/* Modo Personalizado */}
            <TouchableOpacity
              style={[
                s.modeCard,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
              activeOpacity={0.85}
              onPress={() => {}}
            >
              <View
                style={[
                  s.modeIconWrap,
                  {
                    backgroundColor: cardBg,
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

        {/* ── Mis Rutinas ── */}
        <Animated.View style={[s.section, { opacity: fadeAnim }]}>
          <View style={s.routinesHeader}>
            <Text style={[s.sectionTitle, { color: c.text }]}>Mis Rutinas</Text>
            <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
              <Text style={[s.viewAll, { color: TEAL }]}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {MOCK_ROUTINES.map((routine) => (
            <RoutineCard
              key={routine.routineId}
              routine={routine}
              accentColor={TEAL}
              cardBg={cardBg}
              borderColor={borderCol}
              textColor={c.text}
              subColor={subColor}
            />
          ))}
        </Animated.View>

        {/* ── Cuenta ── */}
        <Animated.View style={[s.section, { opacity: fadeAnim }]}>
          <Text style={[s.sectionLabel, { color: subColor }]}>CUENTA</Text>
          <View style={[s.group, { borderColor: borderCol }]}>
            <MenuRow
              icon="account-edit-outline"
              label="Editar perfil"
              onPress={() => {}}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
            />
            <View style={[s.separator, { backgroundColor: borderCol }]} />
            <MenuRow
              icon="bell-outline"
              label="Notificaciones"
              onPress={() => {}}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
            />
            <View style={[s.separator, { backgroundColor: borderCol }]} />
            <MenuRow
              icon="lock-outline"
              label="Cambiar contraseña"
              onPress={() => {}}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
            />
          </View>
        </Animated.View>

        {/* ── Preferencias ── */}
        <Animated.View style={[s.section, { opacity: fadeAnim }]}>
          <Text style={[s.sectionLabel, { color: subColor }]}>
            PREFERENCIAS
          </Text>
          <View style={[s.group, { borderColor: borderCol }]}>
            <MenuRow
              icon="theme-light-dark"
              label="Apariencia"
              onPress={() => {}}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
            />
            <View style={[s.separator, { backgroundColor: borderCol }]} />
            <MenuRow
              icon="help-circle-outline"
              label="Ayuda y soporte"
              onPress={() => {}}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
            />
          </View>
        </Animated.View>

        {/* ── Cerrar sesión ── */}
        <Animated.View style={[s.section, { opacity: fadeAnim }]}>
          <View style={[s.group, { borderColor: borderCol }]}>
            <MenuRow
              icon="logout"
              label="Cerrar sesión"
              onPress={handleLogout}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
              destructive
              showChevron={false}
            />
          </View>
        </Animated.View>

        <Text style={[s.version, { color: isDark ? "#1A2030" : "#D8E0EC" }]}>
          Liftly v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 22, gap: 20, paddingBottom: 48 },

  header: { paddingTop: 4 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.8,
    lineHeight: 32,
  },

  // Profile card
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  avatarText: { fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  profileEmail: { fontSize: 12, fontWeight: "500" },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9,
    borderWidth: 1,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  activeBadgeText: { fontSize: 11, fontWeight: "700" },

  // Sections
  section: { gap: 12 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: -6,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    paddingLeft: 2,
  },

  // Modes row
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

  // Routines header
  routinesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "700",
  },

  // Menu groups
  group: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  separator: { height: 1, marginLeft: 52 },

  version: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
});

// ─── Routine Card Styles ──────────────────────────────────────────────────────

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
    backgroundColor: "rgba(0,0,0,0.25)",
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
  duration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.2,
  },
});

const r = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "600" },
});

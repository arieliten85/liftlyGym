import { ImageSection } from "@/features/build-routine/components/ImageSection";
import { estimateDuration } from "@/features/build-routine/utils/estimateDuration";
import { RoutineService } from "@/services/routineService";
import { PrimaryButton } from "@/shared/components/PrimaryButton";
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

const routineService = new RoutineService();

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
  const expColor = "#cfd0d1";
  const coverColor = "#1A1A1A";
  const duration = estimateDuration(routine.exercises);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const ROUTINEMODE = {
    quick: "Rápida",
    custom: "Personalizada",
  };

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

      {/* Cover con imagen */}
      <View style={rc.cover}>
        <ImageSection coverColor={coverColor} routineName={routine.name} />
        <View style={rc.coverOverlay} />
      </View>

      <View style={rc.badgeRow}>
        <View style={rc.modeBadge}>
          <Text style={rc.modeText}>{ROUTINEMODE[routine.mode]}</Text>
        </View>
        <View style={rc.modeBadge}>
          <Text style={rc.modeText}>{routine.goal}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={rc.body}>
        <View style={rc.bodyTop}>
          <View style={{ flex: 1 }}>
            <Text style={[rc.name, { color: textColor }]} numberOfLines={1}>
              {routine.name} day
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

        <PrimaryButton
          iconRight={"play"}
          label={"Iniciar"}
          onPress={() => onStart(routine)}
        />
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
              onPress={() => router.push("/(onboarding)/(build-routine)/goals")}
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
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  cover: {
    height: 130,
    position: "relative",
    overflow: "hidden",
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 1,
  },
  expBadge: {
    position: "absolute",
    bottom: 12,
    left: 0,
    zIndex: 2,
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
    textTransform: "capitalize",
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
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },

  modeBadge: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  modeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  badgeRow: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    gap: 6,
    zIndex: 2,
  },
});

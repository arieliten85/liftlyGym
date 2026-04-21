import { RoutineService } from "@/services/routineService";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useNotificationStore } from "@/store/notification/usenotificationstore";
import { useRoutineStore } from "@/store/routine/useRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { Routine } from "@/types/routine";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { WeeklyPlanCard } from "../components/WeeklyPlanCard";
import { groupRoutines } from "../utils/groupRoutines";

const routineService = new RoutineService();

type TabKey = "quick" | "plans";

export default function RoutineScreen() {
  const { theme, isDark } = useAppTheme();
  const c = theme;
  const { setRoutine } = useRoutineStore();
  const setMode = useBuildRoutineStore((s) => s.setMode);

  const bg = isDark ? "#070B12" : c.background;
  const cardBg = isDark ? "#0E1219" : c.card;
  const subColor = isDark ? "#4A5568" : c.textSecondary;
  const borderCol = isDark ? "#141922" : c.border;
  const TEAL = c.primary;

  const [selectedMode, setSelectedMode] = useState<"quick" | "custom" | null>(
    null,
  );

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;
  const tabIndicator = useRef(new Animated.Value(0)).current;

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("quick");

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
    ]).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchRoutines = async () => {
        try {
          setLoading(true);
          const data = await routineService.getUserRoutines();
          setRoutines(data);
        } catch (error) {
          console.error("Error loading routines:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRoutines();
    }, []),
  );

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

  const confirmDeletePlan = (planIds: string[]) => {
    Alert.alert(
      "Eliminar plan semanal",
      `Esto eliminará las ${planIds.length} rutinas del plan. ¿Seguro?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar todo",
          style: "destructive",
          onPress: () => planIds.forEach((id) => handleDeleteRoutine(id)),
        },
      ],
    );
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

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab);
    Animated.spring(tabIndicator, {
      toValue: tab === "quick" ? 0 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  };

  const { weeklyPlans, singles } = groupRoutines(routines);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bg,
        }}
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
      {/* ── Sección crear ── */}
      <Animated.View
        style={[
          styles.createSection,
          {
            backgroundColor: isDark ? "#0E1219" : c.card,
            borderBottomColor: borderCol,
            opacity: headerFade,
            transform: [{ translateY: headerSlide }],
          },
        ]}
      >
        <Text style={[styles.createLabel, { color: subColor }]}>
          NUEVA RUTINA
        </Text>
        <View style={styles.modesRow}>
          {/* Modo Rápido */}
          <TouchableOpacity
            style={[
              styles.modeCard,
              {
                backgroundColor:
                  selectedMode === "quick"
                    ? isDark
                      ? "#091714"
                      : "rgba(46,207,190,0.05)"
                    : cardBg,
                borderColor: selectedMode === "quick" ? TEAL : borderCol,
              },
            ]}
            onPress={() => {
              setSelectedMode("quick");
              setMode("quick");
              router.push("/(onboarding)/(build-routine)/goals?from=tabs");
            }}
          >
            <View
              style={[
                styles.modeIconWrap,
                {
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: borderCol,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={20}
                color="#fff"
              />
            </View>
            <Text style={[styles.modeTitle, { color: c.text }]}>
              Modo rápido
            </Text>
            <Text style={[styles.modeDesc, { color: subColor }]}>
              Plan generado por IA
            </Text>
          </TouchableOpacity>

          {/* Modo Custom */}
          <TouchableOpacity
            style={[
              styles.modeCard,
              {
                backgroundColor:
                  selectedMode === "custom" ? `${TEAL}10` : cardBg,
                borderColor: selectedMode === "custom" ? TEAL : borderCol,
              },
            ]}
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
                  borderWidth: 1,
                  borderColor: borderCol,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="pencil-ruler"
                size={20}
                color={subColor}
              />
            </View>
            <Text style={[styles.modeTitle, { color: c.text }]}>
              Modo custom
            </Text>
            <Text style={[styles.modeDesc, { color: subColor }]}>
              Armá desde cero
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Tabs ── */}
      <View
        style={[
          styles.tabsBar,
          {
            backgroundColor: isDark ? "#0E1219" : c.card,
            borderBottomColor: borderCol,
          },
        ]}
      >
        {(["quick", "plans"] as TabKey[]).map((tab) => {
          const isActive = activeTab === tab;
          const count = tab === "quick" ? singles.length : weeklyPlans.length;
          const label = tab === "quick" ? "Rutinas rápidas" : "Planes";
          return (
            <TouchableOpacity
              key={tab}
              style={styles.tabBtn}
              onPress={() => switchTab(tab)}
              activeOpacity={0.7}
            >
              <View style={styles.tabInner}>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? TEAL : subColor },
                  ]}
                >
                  {label}
                </Text>
                {count > 0 && (
                  <View
                    style={[
                      styles.tabCount,
                      {
                        backgroundColor: isActive
                          ? `${TEAL}20`
                          : isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.05)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabCountText,
                        { color: isActive ? TEAL : subColor },
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </View>
              {/* Línea activa */}
              {isActive && (
                <View
                  style={[styles.tabActiveLine, { backgroundColor: TEAL }]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Contenido del tab ── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "quick" ? (
          singles.length === 0 ? (
            <EmptyState
              icon="lightning-bolt"
              text="No tenés rutinas rápidas todavía"
              sub="Creá una con el Modo rápido"
              color={TEAL}
              subColor={subColor}
              textColor={c.text}
            />
          ) : (
            singles.map((routine, index) => (
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
          )
        ) : weeklyPlans.length === 0 ? (
          <EmptyState
            icon="calendar-week"
            text="No tenés planes semanales todavía"
            sub="Creá uno con el Modo custom"
            color={TEAL}
            subColor={subColor}
            textColor={c.text}
          />
        ) : (
          weeklyPlans.map((plan, index) => (
            <WeeklyPlanCard
              key={plan.groupId}
              plan={plan}
              accentColor={TEAL}
              cardBg={cardBg}
              borderColor={borderCol}
              textColor={c.text}
              subColor={subColor}
              index={index}
              onDelete={(id) => {
                const allIds = plan.routines
                  .map((r) => r.routineId)
                  .filter(Boolean) as string[];
                allIds.length === 1
                  ? confirmDelete(id)
                  : confirmDeletePlan(allIds);
              }}
              onStart={handleStartRoutine}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyState({
  icon,
  text,
  sub,
  color,
  subColor,
  textColor,
}: {
  icon: string;
  text: string;
  sub: string;
  color: string;
  subColor: string;
  textColor: string;
}) {
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons name={icon as any} size={28} color={color} />
      </View>
      <Text style={[styles.emptyText, { color: textColor }]}>{text}</Text>
      <Text style={[styles.emptySub, { color: subColor }]}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // Crear
  createSection: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 10,
  },
  createLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  modesRow: { flexDirection: "row", gap: 10 },
  modeCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  modeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modeTitle: { fontSize: 13, fontWeight: "800", letterSpacing: -0.2 },
  modeDesc: { fontSize: 11, fontWeight: "500", lineHeight: 15 },

  // Tabs
  tabsBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 0,
  },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingBottom: 10,
  },
  tabLabel: { fontSize: 13, fontWeight: "700" },
  tabCount: {
    borderRadius: 99,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  tabCountText: { fontSize: 11, fontWeight: "700" },
  tabActiveLine: {
    height: 2,
    width: "60%",
    borderRadius: 1,
  },

  // Scroll
  scroll: { padding: 16, gap: 12, paddingBottom: 48 },

  // Empty
  empty: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyText: { fontSize: 15, fontWeight: "700", textAlign: "center" },
  emptySub: { fontSize: 13, fontWeight: "500", textAlign: "center" },
});

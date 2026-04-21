import { estimateDuration } from "@/features/build-routine/utils/estimateDuration";
import { useSelectedPlanStore } from "@/store/build-rotine/mode/plan/useSelectedPlanStore";
import { Routine } from "@/types/routine";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MUSCLE_COLORS } from "../constants/muscleColors";
import { WeeklyPlanGroup } from "../utils/groupRoutines";

interface WeeklyPlanCardProps {
  plan: WeeklyPlanGroup;
  accentColor: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  subColor: string;
  index: number;
  onDelete: (id: string) => void;
  onStart: (routine: Routine) => void; // lo dejamos por compatibilidad
}

const GOAL_LABEL: Record<string, string> = {
  fuerza: "Fuerza",
  hipertrofia: "Hipertrofia",
  masa: "Masa muscular",
  strength: "Fuerza",
  hypertrophy: "Hipertrofia",
  mass: "Masa muscular",
};

export function WeeklyPlanCard({
  plan,
  accentColor,
  cardBg,
  borderColor,
  textColor,
  subColor,
  index,
  onDelete,
}: WeeklyPlanCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const setSelectedPlan = useSelectedPlanStore((s) => s.setSelectedPlan);

  const totalExercises = plan.routines.reduce(
    (acc, r) => acc + r.exercises.length,
    0,
  );
  const totalDuration = plan.routines.reduce(
    (acc, r) => acc + estimateDuration(r.exercises),
    0,
  );
  const goal = plan.routines[0]?.goal ?? "";

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

  const handlePress = () => {
    setSelectedPlan(plan);
    router.push({
      pathname: "/(app)/(plan)/[groupId]" as any,
      params: { groupId: plan.groupId },
    });
  };

  return (
    <Animated.View
      style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardBg, borderColor }]}
        onPress={handlePress}
        activeOpacity={0.82}
      >
        {/* ── HEADER: badge + trash ── */}
        <View
          style={[styles.header, { borderBottomColor: `${accentColor}20` }]}
        >
          <View
            style={[
              styles.planBadge,
              {
                backgroundColor: `${accentColor}18`,
                borderColor: `${accentColor}35`,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-week"
              size={11}
              color={accentColor}
            />
            <Text style={[styles.planBadgeText, { color: accentColor }]}>
              PLAN SEMANAL
            </Text>
          </View>

          {/* Flecha indicando que es navegable */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                plan.routines.forEach((r) => {
                  if (r.routineId) onDelete(r.routineId);
                });
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.trashBtn}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={17}
                color="#EF4444"
              />
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={accentColor}
            />
          </View>
        </View>

        {/* ── META: título + stats ── */}
        <View style={styles.meta}>
          <Text style={[styles.planTitle, { color: textColor }]}>
            {plan.days.length} días · {GOAL_LABEL[goal] ?? goal}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={11}
                color={subColor}
              />
              <Text style={[styles.statText, { color: subColor }]}>
                {totalExercises} ejercicios
              </Text>
            </View>
            <View style={[styles.statDot, { backgroundColor: subColor }]} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={11}
                color={subColor}
              />
              <Text style={[styles.statText, { color: subColor }]}>
                ~{totalDuration} min
              </Text>
            </View>
          </View>
        </View>

        {/* ── DÍAS: chips horizontales ── */}
        <View style={styles.daysRow}>
          {plan.days.map((d, i) => {
            const color = MUSCLE_COLORS[i % MUSCLE_COLORS.length];
            return (
              <View
                key={`${d.day}-${i}`}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: `${color}18`,
                    borderColor: `${color}35`,
                  },
                ]}
              >
                <Text style={[styles.dayChipDay, { color }]}>
                  {d.day.slice(0, 3).toUpperCase()}
                </Text>
                <Text
                  style={[styles.dayChipMuscle, { color: subColor }]}
                  numberOfLines={1}
                >
                  {d.muscle}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── CTA: toque para ver el plan ── */}
        <View style={[styles.footer, { borderTopColor: `${accentColor}15` }]}>
          <Text style={[styles.footerText, { color: accentColor }]}>
            Tocar para ver el plan completo
          </Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={14}
            color={accentColor}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trashBtn: {
    padding: 2,
  },
  meta: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 6,
  },
  planTitle: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    opacity: 0.5,
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  dayChip: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 70,
    maxWidth: 110,
  },
  dayChipDay: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  dayChipMuscle: {
    fontSize: 10,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
});

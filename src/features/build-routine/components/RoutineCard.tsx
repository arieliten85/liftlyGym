import { ImageSection } from "@/features/build-routine/components/ImageSection";
import { estimateDuration } from "@/features/build-routine/utils/estimateDuration";
import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { Routine } from "@/types/routine/session.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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

export function RoutineCard({
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
        styles.card,
        { backgroundColor: cardBg, borderColor },
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {routine.routineId && (
        <TouchableOpacity
          onPress={() => onDelete(routine.routineId!)}
          style={styles.deleteButton}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={18}
            color="#EF4444"
          />
        </TouchableOpacity>
      )}

      <View style={styles.cover}>
        <ImageSection coverColor={coverColor} routineName={routine.name} />
        <View style={styles.coverOverlay} />
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.modeBadge}>
          <Text style={styles.modeText}>{ROUTINEMODE[routine.mode]}</Text>
        </View>
        <View style={styles.modeBadge}>
          <Text style={styles.modeText}>{routine.goal}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
              {routine.name} day
            </Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={12}
              color={subColor}
            />
            <Text style={[styles.metaText, { color: subColor }]}>
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

const styles = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  cover: { height: 130, position: "relative", overflow: "hidden" },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 1,
  },
  body: { padding: 16, gap: 12 },
  bodyTop: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  name: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.4,
    marginBottom: 3,
    textTransform: "capitalize",
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  metaText: { fontSize: 12, fontWeight: "600" },
  deleteButton: { position: "absolute", top: 10, right: 10, zIndex: 10 },
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

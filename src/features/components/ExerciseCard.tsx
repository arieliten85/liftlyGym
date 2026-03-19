import { ExerciseProgress, RoutineExercise } from "@/type/routine.type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ThemeColors {
  surface: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  border: string;
  bg: string;
  cardBg: string;
}

interface ExerciseCardProps {
  exercise: RoutineExercise & { index: number };
  index: number;
  colors: ThemeColors;
  isDark: boolean;
  isCompleted: boolean;
  isSelected: boolean;
  progress: ExerciseProgress | undefined;
  onSelect: () => void;
  onStart: () => void;
  onEdit: () => void;
  /** Se llama cuando el ejercicio ya está completado y el usuario toca la card */
  onViewSummary: () => void;
  formatRestTime: (s: number) => string;
  formatTextTitle: (s: string) => string;
}

export function ExerciseCard({
  exercise,
  index,
  colors,
  isDark,
  isCompleted,
  isSelected,
  progress,
  onSelect,
  onStart,
  onViewSummary,
  formatRestTime,
  formatTextTitle,
}: ExerciseCardProps) {
  const dv = progress?.displayValues;
  const displayReps = dv?.reps ?? exercise.reps;
  const displayWeight = dv?.weight ?? exercise.weight ?? 0;
  const displayRest = dv?.restSeconds ?? exercise.restSeconds;
  const displaySets = dv?.sets ?? exercise.sets;

  const setsCompleted = progress?.setLogs.filter((l) => !l.skipped).length ?? 0;
  const setsSkipped = progress?.setLogs.filter((l) => l.skipped).length ?? 0;
  const currentSet = progress?.currentSet ?? 1;
  const hasStarted = (progress?.setLogs.length ?? 0) > 0;

  const weightAccent = isDark ? "#F59E0B" : "#D97706";
  const restAccent = isDark ? "#34D399" : "#059669";
  const setsAccent = isDark ? "#A78BFA" : "#7C3AED";

  const accentColor = isCompleted
    ? "#22C55E"
    : isSelected
      ? colors.primary
      : isDark
        ? "#2C2C2C"
        : "#E8E8E8";

  // Si está completado, tocar la card abre el resumen de solo lectura
  const handlePress = isCompleted ? onViewSummary : onSelect;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={[
        sty.card,
        {
          backgroundColor: colors.cardBg,
          borderColor: isDark ? "#222" : "#EBEBEB",
          borderLeftColor: accentColor,
          // Sutil opacidad para indicar que está "cerrado"
          opacity: isCompleted ? 0.82 : 1,
        },
      ]}
    >
      {/* ── Fila superior ── */}
      <View style={sty.topRow}>
        <View style={[sty.indexBadge, { backgroundColor: accentColor + "18" }]}>
          {isCompleted ? (
            <Ionicons name="checkmark" size={13} color="#22C55E" />
          ) : (
            <Text
              style={[
                sty.indexNum,
                {
                  color:
                    accentColor === colors.primary
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
            >
              {index + 1}
            </Text>
          )}
        </View>

        <Text
          style={[sty.exName, { color: colors.textPrimary }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {formatTextTitle(exercise.name)}
        </Text>

        {/* Botón de acción: solo visible si NO está completado */}
        {!isCompleted && (
          <TouchableOpacity
            onPress={onStart}
            activeOpacity={0.75}
            style={[
              sty.playBtn,
              {
                backgroundColor: colors.primary + "18",
                borderColor: colors.primary + "35",
              },
            ]}
          >
            <Ionicons
              name={hasStarted ? "play-forward" : "play"}
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}

        {/* Si está completado: badge "Ver resumen" en lugar del botón */}
        {isCompleted && (
          <View style={sty.completedBadge}>
            <Ionicons name="eye-outline" size={12} color="#22C55E" />
            <Text style={sty.completedBadgeText}>Ver</Text>
          </View>
        )}
      </View>

      {/* ── Barra de progreso (si empezó) ── */}
      {hasStarted && (
        <View style={sty.progressRow}>
          <View
            style={[
              sty.progressTrack,
              { backgroundColor: isDark ? "#232323" : "#F0F0F0" },
            ]}
          >
            <View
              style={[
                sty.progressFill,
                {
                  backgroundColor: isCompleted ? "#22C55E" : colors.primary,
                  width: `${Math.min((setsCompleted / displaySets) * 100, 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={[sty.progressLabel, { color: colors.textSecondary }]}>
            {setsCompleted}/{displaySets}
            {setsSkipped > 0 ? ` · ${setsSkipped} salt.` : ""}
          </Text>
        </View>
      )}

      {/* ── Chips de stats ── */}
      <View style={sty.statsRow}>
        <StatChip
          icon="repeat"
          value={displayReps}
          color={colors.primary}
          textColor={colors.textSecondary}
        />
        <StatChip
          icon="barbell-outline"
          value={displayWeight === 0 ? "Sin peso" : `${displayWeight}kg`}
          color={weightAccent}
          textColor={colors.textSecondary}
        />
        <StatChip
          icon="time-outline"
          value={formatRestTime(displayRest)}
          color={restAccent}
          textColor={colors.textSecondary}
        />
        <StatChip
          icon="layers-outline"
          value={
            hasStarted
              ? `${Math.min(currentSet - 1, displaySets)}/${displaySets}`
              : `${displaySets} series`
          }
          color={setsAccent}
          textColor={colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
}

function StatChip({
  icon,
  value,
  color,
  textColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  color: string;
  textColor: string;
}) {
  return (
    <View
      style={[
        sty.chip,
        { backgroundColor: color + "12", borderColor: color + "25" },
      ]}
    >
      <Ionicons name={icon} size={11} color={color} />
      <Text style={[sty.chipText, { color: textColor }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const sty = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: 14,
    gap: 10,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  indexBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  indexNum: { fontSize: 12, fontWeight: "800" },
  exName: { flex: 1, fontSize: 15, fontWeight: "700", letterSpacing: -0.3 },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#22C55E18",
    borderWidth: 1,
    borderColor: "#22C55E35",
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#22C55E",
  },

  progressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressTrack: { flex: 1, height: 5, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressLabel: {
    fontSize: 11,
    fontWeight: "600",
    minWidth: 56,
    textAlign: "right",
  },

  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: { fontSize: 11, fontWeight: "600" },
});

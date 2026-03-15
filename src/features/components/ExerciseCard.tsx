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
}

interface ExerciseCardProps {
  exercise: RoutineExercise;
  index: number;
  colors: ThemeColors;
  isDark: boolean;
  isCompleted: boolean;
  isSelected: boolean;
  progress?: ExerciseProgress;
  onStart: () => void;
  onEdit: () => void;
  formatRestTime: (seconds: number) => string;
  formatTextTitle: (text: string) => string;
  onSelect: () => void;
}

export function ExerciseCard({
  exercise,
  colors,
  isDark,
  isCompleted,
  isSelected,
  progress,
  onStart,
  onEdit,
  formatRestTime,
  formatTextTitle,
  onSelect,
}: ExerciseCardProps) {
   const displayReps = progress?.editedReps ?? exercise.reps;
   const displayRest = progress?.editedRestSeconds ?? exercise.restSeconds;
   const displaySets = progress?.editedSets ?? exercise.sets;

  const isInProgress = !!progress && !isCompleted;

  const setsProgress = isInProgress
    ? (progress!.currentSet - 1) / progress!.totalSets
    : isCompleted
      ? 1
      : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onSelect}
      style={[
        styles.card,
        {
          backgroundColor: isCompleted
            ? colors.primary + "10"
            : isDark
              ? "#1A1A1A"
              : colors.surface,

          borderColor: isSelected ? colors.primary : "transparent",

          borderWidth: isSelected ? 2 : isInProgress ? 1.5 : 1,
        },
      ]}
    >
      {/* ── Name row ── */}
      <View style={styles.nameRow}>
        {/* Edit dots */}
        {!isCompleted ? (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.iconBtn,
              { backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" },
            ]}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={14}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          <View style={[styles.iconBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={13} color="#fff" />
          </View>
        )}

        {/* Exercise name */}
        <Text
          style={[
            styles.name,
            {
              color: isCompleted ? colors.textSecondary : colors.textPrimary,
              textDecorationLine: isCompleted ? "line-through" : "none",
            },
          ]}
          numberOfLines={2}
        >
          {formatTextTitle(exercise.name)}
        </Text>

        {/* Play button */}
        {isCompleted ? (
          <Ionicons
            name="checkmark-circle"
            size={26}
            color={colors.primary + "60"}
          />
        ) : (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onStart();
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.playBtn,
              {
                backgroundColor: isInProgress
                  ? colors.primary
                  : colors.primary + "15",
                borderColor: colors.primary + "40",
              },
            ]}
          >
            <Ionicons
              name={isInProgress ? "play" : "play-outline"}
              size={14}
              color={isInProgress ? "#fff" : colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Detail chips ── */}
      <View
        style={[
          styles.details,
          { backgroundColor: isDark ? "#111" : "#F2F2F2" },
        ]}
      >
        <Chip label="Series" value={displaySets.toString()} colors={colors} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Chip label="Reps" value={displayReps} colors={colors} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Chip
          label="Descanso"
          value={formatRestTime(displayRest)}
          colors={colors}
        />
      </View>

      {/* ── Progress bar ── */}
      {isInProgress && (
        <View style={styles.progressWrap}>
          <View
            style={[styles.progressTrack, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${setsProgress * 100}%`,
                },
              ]}
            />
          </View>

          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
            {progress!.currentSet <= progress!.totalSets
              ? `Serie ${progress!.currentSet} de ${progress!.totalSets}`
              : `${progress!.totalSets} series completadas`}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function Chip({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.chip}>
      <Text style={[styles.chipLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.chipValue, { color: colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    gap: 12,
    marginBottom: 8,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    lineHeight: 22,
  },

  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  details: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  chip: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  chipLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  chipValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  divider: {
    width: 1,
    height: 28,
  },

  progressWrap: { gap: 6 },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EXECISE_IMAGES } from "../build-routine/constants/routine-images.constants";
import {
  ExerciseProgress,
  RoutineExercise,
} from "../build-routine/type/routine-builder.types";

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
  onViewSummary: () => void;
  formatRestTime: (s: number) => string;
  formatTextTitle: (s: string) => string;
}

export function ExerciseCard({
  exercise,

  colors,
  isDark,
  isCompleted,
  isSelected,
  progress,
  onSelect,
  onStart,
  onViewSummary,

  formatTextTitle,
}: ExerciseCardProps) {
  const dv = progress?.displayValues;
  const displayReps = dv?.reps ?? exercise.reps;

  const displaySets = dv?.sets ?? exercise.sets;

  const setsCompleted = progress?.setLogs.filter((l) => !l.skipped).length ?? 0;
  const setsSkipped = progress?.setLogs.filter((l) => l.skipped).length ?? 0;
  const currentSet = progress?.currentSet ?? 1;
  const hasStarted = (progress?.setLogs.length ?? 0) > 0;

  const setsAccent = isDark ? "#A78BFA" : "#7C3AED";

  const accentColor = isCompleted
    ? "#22C55E"
    : isSelected
      ? colors.primary
      : isDark
        ? "#2C2C2C"
        : "#E8E8E8";

  const handlePress = isCompleted ? onViewSummary : onSelect;

  const exerciseImage = EXECISE_IMAGES[exercise.name];

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
          opacity: isCompleted ? 0.82 : 1,
        },
      ]}
    >
      <View style={sty.mainContainer}>
        {/* ── Imagen lateral — solo si existe ── */}
        {exerciseImage && (
          <View
            style={[
              sty.imageContainer,
              { backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5" },
            ]}
          >
            <Image
              source={exerciseImage}
              style={sty.exerciseImage}
              resizeMode="cover"
            />
            {/* Overlay sutil en la parte inferior */}
            <View
              style={[
                sty.imageOverlay,
                {
                  backgroundColor: isCompleted
                    ? "#22C55E22"
                    : isSelected
                      ? colors.primary + "22"
                      : "transparent",
                },
              ]}
            />
          </View>
        )}

        {/* ── Contenido principal ── */}
        <View
          style={[
            sty.contentContainer,
            // Sin imagen: ocupa todo el ancho
            !exerciseImage && { flex: 1 },
          ]}
        >
          {/* Fila superior: badge + nombre + botón */}
          <View style={sty.topRow}>
            {/* Nombre: flex:1 + minWidth:0 para que no desborde */}
            <Text
              style={[sty.exName, { color: colors.textPrimary }]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {formatTextTitle(exercise.name)}
            </Text>

            {/* Botón play — solo si no está completado */}
            {!isCompleted && (
              <TouchableOpacity
                onPress={onStart}
                activeOpacity={0.75}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
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
                  size={15}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}

            {/* Badge "Ver" — solo si está completado */}
            {isCompleted && (
              <View style={sty.completedBadge}>
                <Ionicons name="eye-outline" size={11} color="#22C55E" />
                <Text style={sty.completedBadgeText}>Ver</Text>
              </View>
            )}
          </View>

          {/* Barra de progreso — solo si empezó */}
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
                      width: `${Math.min(
                        (setsCompleted / displaySets) * 100,
                        100,
                      )}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[sty.progressLabel, { color: colors.textSecondary }]}
              >
                {setsCompleted}/{displaySets}
                {setsSkipped > 0 ? ` · ${setsSkipped} salt.` : ""}
              </Text>
            </View>
          )}

          {/* Chips de stats */}
          <View style={sty.statsRow}>
            <StatChip
              icon="layers-outline"
              value={
                hasStarted
                  ? `${Math.min(currentSet - 1, displaySets)}/${displaySets}`
                  : `${displaySets} Sets`
              }
              color={setsAccent}
              textColor={colors.textSecondary}
            />
            <StatChip
              icon="repeat"
              value={`${displayReps} Reps`}
              color={colors.primary}
              textColor={colors.textSecondary}
            />
            {/* <StatChip
              icon="barbell-outline"
              value={displayWeight === 0 ? "Sin peso" : `${displayWeight} kg`}
              color={weightAccent}
              textColor={colors.textSecondary}
            /> */}
            {/* <StatChip
              icon="time-outline"
              value={formatRestTime(displayRest)}
              color={restAccent}
              textColor={colors.textSecondary}
            /> */}
          </View>
        </View>
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
      <Ionicons name={icon} size={10} color={color} />
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
    padding: 12,
    overflow: "hidden",
  },

  /* Layout interno: imagen + contenido */
  mainContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
  },

  /* Imagen: tamaño fijo, ocupa toda la altura del contenido */
  imageContainer: {
    width: 72,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "stretch", // ← se estira a la altura del contenido real
    minHeight: 72,
  },
  exerciseImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  /* Contenido: flex:1 + minWidth:0 evita overflow del texto */
  contentContainer: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },

  /* Fila superior */
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  indexBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  indexNum: {
    fontSize: 11,
    fontWeight: "800",
  },
  exName: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 18,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#22C55E18",
    borderWidth: 1,
    borderColor: "#22C55E35",
    flexShrink: 0,
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#22C55E",
  },

  /* Barra de progreso */
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "600",
    flexShrink: 0,
  },

  /* Chips */
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 10,
    fontWeight: "600",
  },
});

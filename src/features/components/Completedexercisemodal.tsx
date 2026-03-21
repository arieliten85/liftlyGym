import {
  ExerciseProgress,
  RoutineExercise,
  SetLog,
} from "@/types/routine/exercise.type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ThemeColors {
  surface: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  border: string;
  bg: string;
}

interface CompletedExerciseModalProps {
  visible: boolean;
  exercise: RoutineExercise | null;
  progress: ExerciseProgress | null;
  colors: ThemeColors;
  isDark: boolean;
  onClose: () => void;
  formatTextTitle: (text: string) => string;
}

function SetRow({
  log,
  index,
  colors,
  isDark,
}: {
  log: SetLog;
  index: number;
  colors: ThemeColors;
  isDark: boolean;
}) {
  const isSkipped = log.skipped;
  const accent = isSkipped ? "#EF4444" : "#22C55E";
  const bgColor = isSkipped
    ? isDark
      ? "#EF444410"
      : "#FEF2F2"
    : isDark
      ? "#22C55E10"
      : "#F0FDF4";
  const borderColor = isSkipped ? "#EF444425" : "#22C55E25";

  return (
    <View style={[sty.setRow, { backgroundColor: bgColor, borderColor }]}>
      {/* Número de serie */}
      <View style={[sty.setNumBadge, { backgroundColor: accent + "20" }]}>
        <Text style={[sty.setNumText, { color: accent }]}>{index + 1}</Text>
      </View>

      {isSkipped ? (
        <View style={sty.setDataRow}>
          <Ionicons name="play-skip-forward" size={14} color="#EF4444" />
          <Text style={[sty.skippedLabel, { color: "#EF4444" }]}>
            Serie salteada
          </Text>
        </View>
      ) : (
        <View style={sty.setDataRow}>
          {/* Reps */}
          <View style={sty.setChip}>
            <Ionicons name="repeat" size={12} color={colors.primary} />
            <Text style={[sty.setChipValue, { color: colors.textPrimary }]}>
              {log.repsCompleted ?? "—"}
            </Text>
            <Text style={[sty.setChipUnit, { color: colors.textSecondary }]}>
              reps
            </Text>
          </View>

          <View style={[sty.setDivider, { backgroundColor: colors.border }]} />

          {/* Peso */}
          <View style={sty.setChip}>
            <Ionicons
              name="barbell-outline"
              size={12}
              color={isDark ? "#F59E0B" : "#D97706"}
            />
            <Text style={[sty.setChipValue, { color: colors.textPrimary }]}>
              {log.weight && log.weight > 0 ? `${log.weight}` : "—"}
            </Text>
            {log.weight && log.weight > 0 ? (
              <Text style={[sty.setChipUnit, { color: colors.textSecondary }]}>
                kg
              </Text>
            ) : null}
          </View>
        </View>
      )}

      {/* Check o X */}
      <View style={[sty.setStatusIcon, { backgroundColor: accent + "15" }]}>
        <Ionicons
          name={isSkipped ? "close" : "checkmark"}
          size={14}
          color={accent}
        />
      </View>
    </View>
  );
}

export function CompletedExerciseModal({
  visible,
  exercise,
  progress,
  colors,
  isDark,
  onClose,
  formatTextTitle,
}: CompletedExerciseModalProps) {
  if (!exercise || !progress) return null;

  const totalSets = progress.setLogs.length;
  const completedSets = progress.setLogs.filter((l) => !l.skipped).length;
  const skippedSets = progress.setLogs.filter((l) => l.skipped).length;
  const allSkipped = completedSets === 0;

  // Volumen total: suma de reps * peso de series completadas
  const totalVolume = progress.setLogs.reduce((acc, l) => {
    if (l.skipped || !l.repsCompleted || !l.weight) return acc;
    return acc + l.repsCompleted * l.weight;
  }, 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[sty.safe, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={sty.header}>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={[
              sty.closeBtn,
              { backgroundColor: isDark ? "#1E1E1E" : "#F0F0F0" },
            ]}
          >
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={sty.headerCenter}>
            <View
              style={[
                sty.completedPill,
                { backgroundColor: allSkipped ? "#EF444418" : "#22C55E18" },
              ]}
            >
              <Ionicons
                name={allSkipped ? "close-circle" : "checkmark-circle"}
                size={14}
                color={allSkipped ? "#EF4444" : "#22C55E"}
              />
              <Text
                style={[
                  sty.completedPillText,
                  { color: allSkipped ? "#EF4444" : "#22C55E" },
                ]}
              >
                {allSkipped ? "SALTEADO" : "COMPLETADO"}
              </Text>
            </View>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={sty.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Nombre del ejercicio */}
          <View style={sty.nameBlock}>
            <Text
              style={[sty.exerciseName, { color: colors.textPrimary }]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {formatTextTitle(exercise.name)}
            </Text>
            <Text style={[sty.subLabel, { color: colors.textSecondary }]}>
              Resumen de la sesión · solo lectura
            </Text>
          </View>

          {/* Stats rápidos */}
          <View
            style={[
              sty.statsCard,
              {
                backgroundColor: isDark ? "#111" : "#FAFAFA",
                borderColor: isDark ? "#232323" : "#EBEBEB",
              },
            ]}
          >
            <StatBlock
              icon="layers-outline"
              label="Series"
              value={`${completedSets}/${totalSets}`}
              accent={isDark ? "#A78BFA" : "#7C3AED"}
              colors={colors}
            />
            <View
              style={[sty.statDivider, { backgroundColor: colors.border }]}
            />
            <StatBlock
              icon="play-skip-forward-outline"
              label="Salteadas"
              value={`${skippedSets}`}
              accent="#EF4444"
              colors={colors}
            />
            <View
              style={[sty.statDivider, { backgroundColor: colors.border }]}
            />
            <StatBlock
              icon="flash-outline"
              label="Volumen"
              value={totalVolume > 0 ? `${totalVolume}kg` : "—"}
              accent={isDark ? "#F59E0B" : "#D97706"}
              colors={colors}
            />
          </View>

          {/* Lista de series */}
          <View style={sty.setsSection}>
            <View style={sty.sectionHeader}>
              <View
                style={[sty.sectionIconDot, { backgroundColor: "#22C55E20" }]}
              >
                <Ionicons name="list-outline" size={12} color="#22C55E" />
              </View>
              <Text style={[sty.sectionTitle, { color: colors.textSecondary }]}>
                DETALLE POR SERIE
              </Text>
            </View>

            <View style={sty.setsList}>
              {progress.setLogs.map((log, i) => (
                <SetRow
                  key={i}
                  log={log}
                  index={i}
                  colors={colors}
                  isDark={isDark}
                />
              ))}
            </View>
          </View>

          {/* Nota informativa */}
          <View
            style={[
              sty.infoNote,
              {
                backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5",
                borderColor: isDark ? "#2A2A2A" : "#E8E8E8",
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={15}
              color={colors.textSecondary}
            />
            <Text style={[sty.infoText, { color: colors.textSecondary }]}>
              Este ejercicio ya fue registrado. Los datos se guardarán al
              finalizar la rutina.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function StatBlock({
  icon,
  label,
  value,
  accent,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent: string;
  colors: ThemeColors;
}) {
  return (
    <View style={sty.statBlock}>
      <View style={[sty.statIconWrap, { backgroundColor: accent + "18" }]}>
        <Ionicons name={icon} size={14} color={accent} />
      </View>
      <Text style={[sty.statValue, { color: colors.textPrimary }]}>
        {value}
      </Text>
      <Text style={[sty.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

const sty = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  completedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 24,
  },
  completedPillText: { fontSize: 12, fontWeight: "800", letterSpacing: 1 },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 32,
    gap: 16,
  },

  nameBlock: { gap: 4 },
  exerciseName: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  subLabel: { fontSize: 12, fontWeight: "500" },

  statsCard: {
    flexDirection: "row",
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statBlock: { flex: 1, alignItems: "center", gap: 6 },
  statIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: { fontSize: 18, fontWeight: "800", letterSpacing: -0.5 },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  statDivider: { width: 1, alignSelf: "stretch", marginVertical: 4 },

  setsSection: { gap: 10 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  sectionIconDot: {
    width: 22,
    height: 22,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  setsList: { gap: 8 },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  setNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  setNumText: { fontSize: 13, fontWeight: "800" },
  setDataRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  setChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  setChipValue: { fontSize: 15, fontWeight: "800" },
  setChipUnit: { fontSize: 11, fontWeight: "600" },
  setDivider: { width: 1, height: 16 },
  skippedLabel: { fontSize: 13, fontWeight: "600" },
  setStatusIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: { flex: 1, fontSize: 12, fontWeight: "500", lineHeight: 18 },
});

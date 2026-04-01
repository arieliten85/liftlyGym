import { WeekDayKey } from "@/types/routine";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DAYS: { key: WeekDayKey; label: string; full: string }[] = [
  { key: "lun", label: "LUN", full: "Lunes" },
  { key: "mar", label: "MAR", full: "Martes" },
  { key: "mie", label: "MIÉ", full: "Miércoles" },
  { key: "jue", label: "JUE", full: "Jueves" },
  { key: "vie", label: "VIE", full: "Viernes" },
  { key: "sab", label: "SÁB", full: "Sábado" },
  { key: "dom", label: "DOM", full: "Domingo" },
];

const SUGGESTED: Record<string, WeekDayKey[]> = {
  principiante: ["lun", "mie", "vie"],
  intermedio: ["lun", "mar", "jue", "vie"],
  avanzado: ["lun", "mar", "mie", "jue", "vie"],
};

const MIN_DAYS = 2;
const MAX_DAYS = 6;

export default function DaysSelectScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const experience = useBuildRoutineStore((s) => s.experience);
  const setSelectedDays = useBuildRoutineStore((s) => s.setSelectedDays);
  const setDiasEntrenamiento = useBuildRoutineStore(
    (s) => s.setDiasEntrenamiento,
  );

  const [selected, setSelected] = useState<WeekDayKey[]>([]);

  const TEAL = theme.primary;
  const textColor = isDark ? "#DFF0EE" : theme.text;
  const subColor = isDark ? "#4A6A66" : theme.textSecondary;
  const cardBg = isDark ? "#0C1119" : theme.card;
  const borderDef = isDark ? "rgba(46,207,190,0.15)" : theme.border;
  const borderSel = isDark ? "rgba(46,207,190,0.6)" : TEAL;

  useEffect(() => {
    setSelected(
      SUGGESTED[experience ?? "principiante"] ?? ["lun", "mie", "vie"],
    );
  }, []);

  const toggleDay = (day: WeekDayKey) => {
    setSelected((prev) => {
      if (prev.includes(day)) {
        if (prev.length <= MIN_DAYS) return prev;
        return prev.filter((d) => d !== day);
      }
      if (prev.length >= MAX_DAYS) return prev;
      return [...prev, day];
    });
  };

  const handleNext = () => {
    if (selected.length < MIN_DAYS) return;
    const ordered = DAYS.filter((d) => selected.includes(d.key)).map(
      (d) => d.key,
    );
    setSelectedDays(ordered);
    setDiasEntrenamiento(ordered.length);
    router.push(
      `/(onboarding)/(build-routine)/weekPlanBuilder?from=${from ?? "tabs"}`,
    );
  };

  const orderedSelected = DAYS.filter((d) => selected.includes(d.key)).map(
    (d) => d.full,
  );
  const suggestedCount = SUGGESTED[experience ?? "principiante"]?.length ?? 3;

  return (
    <OnboardingLayout
      title="Días de entrenamiento"
      onNext={handleNext}
      isNextDisabled={selected.length < MIN_DAYS}
      nextButtonText="Continuar"
    >
      <View style={s.container}>
        <View style={s.header}>
          <Text style={[s.title, { color: textColor }]}>
            ¿Qué días vas a entrenar?
          </Text>
          <Text style={[s.subtitle, { color: subColor }]}>
            Mínimo {MIN_DAYS} · Máximo {MAX_DAYS} días por semana
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            setSelected(
              SUGGESTED[experience ?? "principiante"] ?? ["lun", "mie", "vie"],
            )
          }
          activeOpacity={0.8}
          style={[
            s.suggestion,
            {
              backgroundColor: isDark
                ? "rgba(46,207,190,0.07)"
                : "rgba(46,207,190,0.06)",
              borderColor: isDark
                ? "rgba(46,207,190,0.2)"
                : "rgba(46,207,190,0.25)",
            },
          ]}
        >
          <Ionicons name="sparkles-outline" size={12} color={TEAL} />
          <Text style={[s.suggestionText, { color: TEAL }]}>
            Sugerido para tu nivel:{" "}
            <Text style={{ fontWeight: "800" }}>{suggestedCount} días</Text>
          </Text>
          <Text style={[s.suggestionAction, { color: subColor }]}>Aplicar</Text>
        </TouchableOpacity>

        <View style={s.daysGrid}>
          {DAYS.map((day) => {
            const isSel = selected.includes(day.key);
            const isDisabled = !isSel && selected.length >= MAX_DAYS;
            return (
              <TouchableOpacity
                key={day.key}
                onPress={() => toggleDay(day.key)}
                disabled={isDisabled}
                activeOpacity={0.8}
                style={[
                  s.dayCard,
                  {
                    backgroundColor: isSel
                      ? isDark
                        ? "#091714"
                        : "#EBF9F7"
                      : cardBg,
                    borderColor: isSel ? borderSel : borderDef,
                    opacity: isDisabled ? 0.35 : 1,
                  },
                ]}
              >
                {isSel && (
                  <View style={[s.dayTopLine, { backgroundColor: TEAL }]} />
                )}
                <Text
                  style={[
                    s.dayLabel,
                    { color: isSel ? TEAL : isDark ? "#DFF0EE" : theme.text },
                  ]}
                >
                  {day.label}
                </Text>
                <View
                  style={[
                    s.dot,
                    isSel
                      ? { backgroundColor: TEAL }
                      : {
                          backgroundColor: "transparent",
                          borderWidth: 1,
                          borderColor: borderDef,
                        },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={[
            s.summaryCard,
            { backgroundColor: cardBg, borderColor: borderDef },
          ]}
        >
          <View style={s.summaryHeader}>
            <Ionicons name="calendar-outline" size={12} color={TEAL} />
            <Text style={[s.summaryLabel, { color: TEAL }]}>TU SEMANA</Text>
            <View
              style={[
                s.countBadge,
                {
                  backgroundColor: isDark
                    ? "rgba(46,207,190,0.12)"
                    : "rgba(46,207,190,0.1)",
                },
              ]}
            >
              <Text style={[s.countText, { color: TEAL }]}>
                {selected.length} días
              </Text>
            </View>
          </View>
          {orderedSelected.length > 0 ? (
            <Text style={[s.summaryDays, { color: textColor }]}>
              {orderedSelected.join(" · ")}
            </Text>
          ) : (
            <Text style={[s.summaryEmpty, { color: subColor }]}>
              Seleccioná al menos {MIN_DAYS} días
            </Text>
          )}
        </View>

        <View
          style={[
            s.infoRow,
            { borderColor: isDark ? "rgba(46,207,190,0.1)" : theme.border },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={12}
            color={subColor}
          />
          <Text style={[s.infoText, { color: subColor }]}>
            {selected.length <= 3
              ? "Frecuencia baja · ideal para recuperación completa"
              : selected.length <= 4
                ? "Frecuencia media · balance entre volumen y recuperación"
                : "Frecuencia alta · descansá bien entre grupos musculares"}
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingBottom: token.spacing.xl },
  header: { marginBottom: token.spacing.md },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "left",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "left",
    lineHeight: 18,
  },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: token.spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: token.spacing.md,
  },
  suggestionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  suggestionAction: {
    fontSize: 12,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: token.spacing.lg,
  },
  dayCard: {
    width: 42,
    height: 58,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    overflow: "hidden",
  },
  dayTopLine: {
    position: "absolute",
    top: 0,
    height: 2,
    width: "70%",
    borderRadius: 1,
    opacity: 0.7,
  },
  dayLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.4 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  summaryCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: token.spacing.md,
    gap: token.spacing.xs,
    marginBottom: token.spacing.sm,
  },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 5 },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    flex: 1,
  },
  countBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  countText: { fontSize: 10, fontWeight: "800" },
  summaryDays: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
  },
  summaryEmpty: { fontSize: 12, lineHeight: 18 },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: token.spacing.xs,
    paddingTop: token.spacing.xs,
    borderTopWidth: 1,
  },
  infoText: { flex: 1, fontSize: 11, lineHeight: 16 },
});

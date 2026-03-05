// src/feature/onboarding/screens/EquipmentListScreen.tsx

import { EquipmentItem, getEquipmentList } from "@/data/equipmentList.data";
import { muscleOptions } from "@/data/mock.data";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { classifyRoutine, ExperienceLevel } from "@/utils/routineClassifier";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MuscleSection {
  muscleId: string;
  muscleTitle: string;
  items: EquipmentItem[];
}

function EquipmentIcon({
  equipment,
  isSelected,
  teal,
  subColor,
}: {
  equipment: string | null;
  isSelected: boolean;
  teal: string;
  subColor: string;
}) {
  const iconName = equipment === "gym" ? "barbell-outline" : "home-outline";
  return (
    <Ionicons name={iconName} size={22} color={isSelected ? teal : subColor} />
  );
}

// Cuántos equipos (= ejercicios potenciales) asignar por grupo muscular
// según nivel. El back usará estos ids para construir la rutina, así que
// menos ids = menos opciones = rutina más acotada y apropiada al nivel.
//   principiante → 2 por grupo: movimientos base, nada más
//   intermedio   → 3 por grupo: agrega un accesorio
//   avanzado     → 4 por grupo: más variedad e intensidad
const EQUIPMENT_PER_MUSCLE: Record<string, number> = {
  principiante: 2,
  intermedio: 3,
  avanzado: 4,
};

function resolveAllEquipmentIds(
  equipment: string | null,
  muscleGroups: string[],
  experience: string | null,
): string[] {
  if (!equipment) return [];
  const perMuscle = EQUIPMENT_PER_MUSCLE[experience ?? "principiante"] ?? 2;
  const seen = new Set<string>();
  const result: string[] = [];
  for (const muscle of muscleGroups) {
    const items = getEquipmentList(equipment, muscle);
    let count = 0;
    for (const item of items) {
      if (count >= perMuscle) break;
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item.id);
        count++;
      }
    }
  }
  return result;
}

// Como profesor de gym: el volumen óptimo por sesión varía según experiencia.
// Principiante → 4–5 ejercicios: aprender el movimiento sin fatigar el SNC.
// Intermedio   → 5–6 ejercicios: técnica consolidada, más volumen controlado.
// Avanzado     → 6–8 ejercicios: periodización, alta intensidad, mayor volumen.
// Con muchos grupos musculares se usa el mínimo del rango para no sobrepasar
// el volumen total recomendado por sesión.
function resolveMaxExercises(
  experience: string | null,
  muscleCount: number,
): number {
  const caps: Record<string, [number, number]> = {
    principiante: [4, 5],
    intermedio: [5, 6],
    avanzado: [6, 8],
  };
  const [min, max] = caps[experience ?? "principiante"] ?? [4, 5];
  return muscleCount <= 2 ? max : min;
}

export default function EquipmentListScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();

  const goal = useOnboardingStore((s) => s.goal);
  const equipment = useOnboardingStore((s) => s.equipment);
  const experience = useOnboardingStore((s) => s.experience);
  const muscleGroups = useOnboardingStore((s) => s.muscleGroups);
  const source = useOnboardingStore((s) => s.source);
  const selectedItems = useOnboardingStore((s) => s.selectedEquipmentItems);
  const toggleEquipmentItem = useOnboardingStore((s) => s.toggleEquipmentItem);
  const setSelectedEquipmentItems = useOnboardingStore(
    (s) => s.setSelectedEquipmentItems,
  );

  const sections = useMemo<MuscleSection[]>(() => {
    return muscleGroups
      .map((muscleId) => {
        const muscleOption = muscleOptions.find((m) => m.id === muscleId);
        const items = getEquipmentList(equipment, muscleId);
        if (!muscleOption || items.length === 0) return null;
        return { muscleId, muscleTitle: muscleOption.title, items };
      })
      .filter(Boolean) as MuscleSection[];
  }, [equipment, muscleGroups]);

  const logAndNavigate = useCallback(
    (equipmentItems: string[], skipped: boolean) => {
      const resolvedEquipment =
        equipmentItems.length > 0
          ? equipmentItems
          : resolveAllEquipmentIds(equipment, muscleGroups, experience);

      const classification = classifyRoutine(
        muscleGroups,
        (experience ?? "principiante") as ExperienceLevel,
      );

      const maxExercisesPerSession = resolveMaxExercises(
        experience,
        muscleGroups.length,
      );

      const payload = {
        goal,
        equipment,
        experience,
        muscleGroups,
        source,
        selectedEquipmentItems: {
          mode:
            skipped || equipmentItems.length === 0
              ? "auto — resuelto por músculo y contexto"
              : "manual — seleccionado por el usuario",
          ids: resolvedEquipment,
        },
        exerciseVolume: {
          maxExercisesPerSession,
          rationale: `Nivel ${experience ?? "principiante"} con ${muscleGroups.length} grupo(s) muscular(es)`,
        },
        routineClassification: {
          splitTags: classification.splitTags,
          duration: `${classification.durationMin} a ${classification.durationMax} minutos`,
          daysPerWeek: classification.daysLabel,
          daySplitSuggestion: classification.daySplitSuggestion ?? null,
          tips: classification.tips,
        },
      };

      console.log(
        "=== ONBOARDING PAYLOAD ===\n",
        JSON.stringify(payload, null, 2),
      );

      router.push("/generate-routine");
    },
    [goal, equipment, experience, muscleGroups, source],
  );

  const handleNext = useCallback(() => {
    logAndNavigate(selectedItems, false);
  }, [selectedItems, logAndNavigate]);

  const handleSkip = useCallback(() => {
    setSelectedEquipmentItems([]);
    logAndNavigate([], true);
  }, [setSelectedEquipmentItems, logAndNavigate]);

  // ─── Theme tokens ─────────────────────────────────────────────────────────
  const TEAL = theme.colors.primary;
  const textColor = isDark ? "#DFF0EE" : theme.colors.text;
  const subColor = isDark ? "#4A6A66" : theme.colors.textSecondary;
  const cardBg = isDark ? "#0C1119" : theme.colors.card;
  const cardBgSel = isDark ? "#091714" : "#EBF9F7";
  const borderDef = isDark ? "rgbaj(46,207,190,0.15)" : theme.colors.border;
  const borderSel = isDark ? "rgba(46,207,190,0.5)" : theme.colors.primary;
  const titleSel = TEAL;
  const descSel = isDark ? "#B8D4D0" : theme.colors.text;
  const contextLabel = equipment === "gym" ? "GYM" : "EN CASA";
  const sectionHeaderBg = isDark
    ? "rgba(46,207,190,0.06)"
    : "rgba(46,207,190,0.07)";
  const sectionDivider = isDark
    ? "rgba(46,207,190,0.12)"
    : "rgba(46,207,190,0.2)";

  const styles = createStyles(isDark, theme);

  return (
    <OnboardingLayout
      title="Equipo"
      onNext={handleNext}
      isNextDisabled={false}
      nextButtonText="Generar Rutina"
    >
      <View style={styles.container}>
        {/* Particles */}
        {isDark &&
          [...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.particle,
                {
                  top: `${(i * 23 + 5) % 88}%` as any,
                  left: `${(i * 31 + 8) % 82}%` as any,
                  opacity: 0.05 + (i % 4) * 0.04,
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                },
              ]}
            />
          ))}

        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            {/* Context pill */}
            <View
              style={[
                styles.contextPill,
                {
                  backgroundColor: isDark
                    ? "rgba(46,207,190,0.08)"
                    : "rgba(46,207,190,0.1)",
                  borderColor: isDark
                    ? "rgba(46,207,190,0.25)"
                    : "rgba(46,207,190,0.35)",
                },
              ]}
            >
              <Ionicons
                name={equipment === "gym" ? "barbell-outline" : "home-outline"}
                size={13}
                color={TEAL}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.contextPillText, { color: TEAL }]}>
                {contextLabel}
              </Text>
            </View>

            {/* Skip button */}
            <TouchableOpacity
              style={[
                styles.skipButton,
                {
                  borderColor: isDark
                    ? "rgba(46,207,190,0.2)"
                    : theme.colors.border,
                },
              ]}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={[styles.skipText, { color: subColor }]}>Omitir</Text>
              <Ionicons
                name="arrow-forward-outline"
                size={13}
                color={subColor}
                style={{ marginLeft: 3 }}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Configura tu entorno
          </Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Seleccioná el equipamiento disponible. Si omitís, lo resolvemos
            automáticamente según tus músculos y contexto.
          </Text>
        </View>

        {/* Grouped list */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section) => (
            <View key={section.muscleId} style={styles.sectionWrapper}>
              {/* Section header */}
              <View
                style={[
                  styles.sectionHeader,
                  {
                    backgroundColor: sectionHeaderBg,
                    borderColor: sectionDivider,
                  },
                ]}
              >
                <View
                  style={[styles.sectionAccentDot, { backgroundColor: TEAL }]}
                />
                <Text style={[styles.sectionLabel, { color: TEAL }]}>
                  {section.muscleTitle}
                </Text>
                {(() => {
                  const count = section.items.filter((i) =>
                    selectedItems.includes(i.id),
                  ).length;
                  return count > 0 ? (
                    <View
                      style={[styles.sectionBadge, { backgroundColor: TEAL }]}
                    >
                      <Text
                        style={[
                          styles.sectionBadgeText,
                          { color: isDark ? "#042220" : "#fff" },
                        ]}
                      >
                        {count}
                      </Text>
                    </View>
                  ) : null;
                })()}
              </View>

              {/* Items */}
              <View
                style={[
                  styles.itemsGroup,
                  {
                    borderColor: isDark
                      ? "rgba(46,207,190,0.10)"
                      : "rgba(0,0,0,0.07)",
                  },
                ]}
              >
                {section.items.map((item, itemIndex) => {
                  const isSelected = selectedItems.includes(item.id);
                  const isLast = itemIndex === section.items.length - 1;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.card,
                        !isLast && {
                          borderBottomWidth: 1,
                          borderBottomColor: isSelected
                            ? "transparent"
                            : borderDef,
                        },
                        { backgroundColor: isSelected ? cardBgSel : cardBg },
                        isSelected && {
                          borderColor: borderSel,
                          shadowColor: TEAL,
                        },
                      ]}
                      onPress={() => toggleEquipmentItem(item.id)}
                      activeOpacity={0.8}
                    >
                      {/* Selected top accent line */}
                      {isSelected && (
                        <View
                          style={[
                            styles.cardTopLine,
                            { backgroundColor: TEAL },
                          ]}
                        />
                      )}

                      <View style={styles.cardInner}>
                        {/* Icon badge */}
                        <View
                          style={[
                            styles.iconBadge,
                            {
                              backgroundColor: isSelected
                                ? isDark
                                  ? "rgba(46,207,190,0.12)"
                                  : "rgba(46,207,190,0.12)"
                                : isDark
                                  ? "rgba(255,255,255,0.04)"
                                  : "rgba(0,0,0,0.04)",
                              borderColor: isSelected
                                ? isDark
                                  ? "rgba(46,207,190,0.35)"
                                  : "rgba(46,207,190,0.4)"
                                : isDark
                                  ? "rgba(255,255,255,0.06)"
                                  : theme.colors.border,
                            },
                          ]}
                        >
                          <EquipmentIcon
                            equipment={equipment}
                            isSelected={isSelected}
                            teal={TEAL}
                            subColor={subColor}
                          />
                        </View>

                        <View style={styles.cardText}>
                          <Text
                            style={[
                              styles.cardTitle,
                              { color: isSelected ? titleSel : textColor },
                            ]}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={[
                              styles.cardSubtitle,
                              { color: isSelected ? descSel : subColor },
                            ]}
                            numberOfLines={2}
                          >
                            {item.subtitle}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.checkCircle,
                            {
                              borderColor: isSelected ? TEAL : borderDef,
                              backgroundColor: isSelected
                                ? TEAL
                                : "transparent",
                            },
                          ]}
                        >
                          {isSelected && (
                            <Ionicons
                              name="checkmark"
                              size={13}
                              color={isDark ? "#042220" : "#fff"}
                            />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Counter */}
        <View
          style={[
            styles.counterContainer,
            {
              borderTopColor: isDark
                ? "rgba(46,207,190,0.12)"
                : theme.colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.counterText,
              { color: selectedItems.length > 0 ? TEAL : subColor },
            ]}
          >
            {selectedItems.length > 0
              ? `${selectedItems.length} ${
                  selectedItems.length === 1
                    ? "elemento seleccionado"
                    : "elementos seleccionados"
                }`
              : ""}
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const createStyles = (isDark: boolean, theme: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    particle: {
      position: "absolute",
      borderRadius: 2,
      backgroundColor: "#2ECFBE",
    },
    headerContainer: {
      marginBottom: token.spacing.lg,
      marginTop: token.spacing.xs,
    },
    headerTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: token.spacing.sm,
    },
    contextPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
    },
    contextPillText: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1,
    },
    skipButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
      borderWidth: 1,
    },
    skipText: {
      fontSize: 12,
      fontWeight: "500",
    },
    sectionTitle: {
      fontSize: token.typography.h2,
      fontWeight: "bold",
      textAlign: "left",
      marginBottom: token.spacing.xs / 2,
    },
    sectionSubtitle: {
      fontSize: token.typography.bodySmall,
      textAlign: "left",
      lineHeight: 20,
    },
    scrollView: { flex: 1 },
    scrollContent: {
      gap: token.spacing.lg,
      paddingBottom: token.spacing.sm,
    },
    sectionWrapper: { gap: 0 },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: token.spacing.md,
      paddingVertical: token.spacing.sm,
      borderRadius: 10,
      borderWidth: 1,
      marginBottom: token.spacing.sm,
      gap: 8,
    },
    sectionAccentDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    sectionLabel: {
      flex: 1,
      fontSize: token.typography.bodySmall,
      fontWeight: "800",
      letterSpacing: 1.2,
    },
    sectionBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      paddingHorizontal: 6,
      alignItems: "center",
      justifyContent: "center",
    },
    sectionBadgeText: {
      fontSize: 11,
      fontWeight: "700",
    },
    itemsGroup: {
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
    },
    card: {
      overflow: "hidden",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    cardTopLine: {
      height: 1.5,
      width: "70%",
      alignSelf: "center",
      opacity: 0.6,
      borderRadius: 1,
    },
    cardInner: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: token.spacing.lg,
      paddingVertical: token.spacing.md,
      gap: token.spacing.md,
    },
    iconBadge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    cardText: { flex: 1 },
    cardTitle: {
      fontSize: token.typography.body,
      fontWeight: "bold",
      letterSpacing: 0.4,
      marginBottom: 2,
    },
    cardSubtitle: {
      fontSize: token.typography.bodySmall,
      lineHeight: 17,
    },
    checkCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    counterContainer: {
      paddingVertical: token.spacing.sm,
      alignItems: "center",
      borderTopWidth: 1,
      marginTop: token.spacing.xs,
    },
    counterText: {
      fontSize: token.typography.body,
      fontWeight: "500",
    },
  });

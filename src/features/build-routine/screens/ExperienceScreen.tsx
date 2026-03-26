import OnboardingLayout from "@/shared/components/OnboardingLayout";

import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  EXPERIENCE_OPTION_DATA,
  LEVEL_OPTION_DATA,
} from "../constants/routine-builder.constants";

export default function ExperienceScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();

  const selectedLevel = useBuildRoutineStore((s) => s.experience);
  const setExperience = useBuildRoutineStore((s) => s.setExperience);

  const handleNext = () => {
    if (selectedLevel) router.push("/(onboarding)/(build-routine)/splitSelect");
  };

  const TEAL = theme.primary;
  const cardBg = isDark ? "#0C1119" : theme.card;
  const cardBgSel = isDark ? "#091714" : "#EBF9F7";
  const borderDef = isDark ? "rgba(46,207,190,0.15)" : theme.border;
  const borderSel = isDark ? "rgba(46,207,190,0.5)" : theme.primary;
  const textColor = isDark ? "#DFF0EE" : theme.text;
  const subColor = isDark ? "#4A6A66" : theme.textSecondary;
  const titleSel = TEAL;
  const descSel = isDark ? "#B8D4D0" : theme.text;

  const styles = createStyles(isDark, theme);

  return (
    <OnboardingLayout
      title="Experiencia"
      onNext={handleNext}
      isNextDisabled={!selectedLevel}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            ¿Cuál es tu nivel de experiencia?
          </Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Selecciona tu nivel para ajustar la intensidad de tu plan
          </Text>
        </View>

        <View style={styles.optionsWrapper}>
          <View style={styles.optionsContainer}>
            {EXPERIENCE_OPTION_DATA.map((option) => {
              const isSel = selectedLevel === option.type;
              const meta = LEVEL_OPTION_DATA[option.type] ?? {
                icon: "star",
                iconFamily: "FontAwesome",
                label: "LVL",
                color: TEAL,
              };

              return (
                <TouchableOpacity
                  key={option.type}
                  style={[
                    styles.goalCard,
                    { backgroundColor: cardBg, borderColor: borderDef },
                    isSel && {
                      backgroundColor: cardBgSel,
                      borderColor: borderSel,
                      shadowColor: TEAL,
                    },
                  ]}
                  onPress={() => setExperience(option.type)}
                  activeOpacity={0.8}
                >
                  {isSel && (
                    <View
                      style={[styles.cardTopLine, { backgroundColor: TEAL }]}
                    />
                  )}

                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.cardIconWrap,
                        {
                          backgroundColor: isSel
                            ? isDark
                              ? `${meta.color}18`
                              : `${meta.color}18`
                            : isDark
                              ? "rgba(255,255,255,0.04)"
                              : "rgba(0,0,0,0.04)",
                          borderColor: isSel
                            ? isDark
                              ? `${meta.color}55`
                              : `${meta.color}55`
                            : isDark
                              ? "rgba(255,255,255,0.06)"
                              : theme.border,
                        },
                      ]}
                    >
                      {meta.iconFamily === "FontAwesome" ? (
                        <FontAwesome
                          name={meta.icon as any}
                          size={20}
                          color={isSel ? meta.color : subColor}
                        />
                      ) : (
                        <Feather
                          name={meta.icon as any}
                          size={20}
                          color={isSel ? meta.color : subColor}
                        />
                      )}
                    </View>

                    <View style={styles.cardText}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.goalTitle,
                          { color: isSel ? titleSel : textColor },
                        ]}
                      >
                        {option.title}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.goalDescription,
                          { color: isSel ? descSel : subColor },
                        ]}
                      >
                        {option.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
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
      marginBottom: token.spacing.xl,
      marginTop: token.spacing.xs,
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

    optionsWrapper: { flex: 1, justifyContent: "flex-start" },
    optionsContainer: { gap: token.spacing.md },

    goalCard: {
      width: "100%",
      borderRadius: 16,
      borderWidth: 1,
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
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: token.spacing.lg,
      paddingVertical: token.spacing.md,
      gap: token.spacing.md,
    },
    cardIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    cardText: { flex: 1 },

    goalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      letterSpacing: 0.5,
      textAlign: "left",
      marginBottom: 3,
    },
    goalDescription: {
      fontSize: token.typography.bodySmall,
      textAlign: "left",
      lineHeight: 18,
    },

    bottomSpacer: { height: token.spacing.sm },
  });

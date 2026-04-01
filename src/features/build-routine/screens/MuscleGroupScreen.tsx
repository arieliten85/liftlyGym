import { QUICK_OPTION_DATA } from "@/features/build-routine/constants/routine-builder.constants";
import { ROUTINE_IMAGES } from "@/features/build-routine/constants/routine-images.constants";
import { RoutineSelectionOption } from "@/types/routine";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";

import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = token.spacing.lg * 2;
const COLUMN_GAP = token.spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING - COLUMN_GAP) / 2;

function RoutineCard({
  option,
  isSelected,
  onPress,
  isDark,
  teal,
  borderDef,
  theme,
}: {
  option: RoutineSelectionOption;
  isSelected: boolean;
  onPress: () => void;
  isDark: boolean;
  teal: string;
  borderDef: string;
  theme: any;
}) {
  const image = option.image ?? ROUTINE_IMAGES[option.type];
  const title = "label" in option ? option.label : option.title;
  const borderSel = isDark ? "rgba(46,207,190,0.6)" : teal;
  const cardBg = isDark ? "#0C1119" : theme.card;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        cardStyles.card,
        {
          width: CARD_WIDTH,
          borderColor: isSelected ? borderSel : borderDef,
          shadowColor: isSelected ? teal : "transparent",
          backgroundColor: cardBg,
        },
      ]}
    >
      {isSelected && (
        <View style={[cardStyles.cardTopLine, { backgroundColor: teal }]} />
      )}

      <View style={cardStyles.imageContainer}>
        {image ? (
          <Image source={image} style={cardStyles.image} resizeMode="cover" />
        ) : (
          <View
            style={[
              cardStyles.imageFallback,
              {
                backgroundColor: isDark
                  ? "rgba(46,207,190,0.08)"
                  : "rgba(46,207,190,0.06)",
              },
            ]}
          >
            {option.icon && (
              <Ionicons
                name={option.icon as any}
                size={32}
                color={
                  isSelected ? teal : isDark ? "#4A6A66" : theme.textSecondary
                }
              />
            )}
          </View>
        )}

        <View
          style={[
            cardStyles.imageOverlay,
            {
              backgroundColor: isSelected
                ? isDark
                  ? "rgba(2,20,18,0.38)"
                  : "rgba(0,80,70,0.22)"
                : isDark
                  ? "rgba(0,0,0,0.45)"
                  : "rgba(0,0,0,0.28)",
            },
          ]}
        />

        {isSelected && (
          <View style={[cardStyles.checkBadge, { backgroundColor: teal }]}>
            <Ionicons name="checkmark" size={10} color="#fff" />
          </View>
        )}
      </View>

      <View
        style={[
          cardStyles.footer,
          {
            backgroundColor: isSelected
              ? isDark
                ? "#091714"
                : "#EBF9F7"
              : isDark
                ? "#0C1119"
                : theme.card,
            borderTopColor: isSelected
              ? isDark
                ? "rgba(46,207,190,0.25)"
                : "rgba(46,207,190,0.35)"
              : isDark
                ? "rgba(255,255,255,0.05)"
                : theme.border,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            cardStyles.title,
            {
              color: isSelected ? teal : isDark ? "#DFF0EE" : theme.text,
            },
          ]}
        >
          {title}
        </Text>
        {"subtitle" in option && option.subtitle && (
          <Text
            numberOfLines={2}
            style={[
              cardStyles.subtitle,
              {
                color: isDark
                  ? isSelected
                    ? "#B8D4D0"
                    : "#4A6A66"
                  : theme.textSecondary,
              },
            ]}
          >
            {option.subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function MuscleGroupScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();

  const selectedRoutine = useBuildRoutineStore((s) => s.routine);
  const setRoutine = useBuildRoutineStore((s) => s.setRoutine);
  const hasSelection = selectedRoutine !== null;

  const { from } = useLocalSearchParams<{ from?: string }>();

  const handleNext = () => {
    if (!hasSelection) return;
    router.push(`/(onboarding)/(build-routine)/confirm?from=${from}`);
  };

  const TEAL = theme.primary;
  const textColor = isDark ? "#DFF0EE" : theme.text;
  const subColor = isDark ? "#4A6A66" : theme.textSecondary;
  const borderDef = isDark ? "rgba(46,207,190,0.15)" : theme.border;

  const rows = useMemo(() => {
    const result: (typeof QUICK_OPTION_DATA)[] = [];
    for (let i = 0; i < QUICK_OPTION_DATA.length; i += 2) {
      result.push(QUICK_OPTION_DATA.slice(i, i + 2));
    }
    return result;
  }, []);

  return (
    <OnboardingLayout
      title="Tipo de rutina"
      onNext={handleNext}
      isNextDisabled={!hasSelection}
      nextButtonText="Continuar"
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            ¿Cómo querés entrenar hoy?
          </Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Elegí el tipo de rutina que mejor se adapte a tus objetivos
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: token.spacing.xl }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {rows.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.row}>
                {row.map((option) => (
                  <RoutineCard
                    key={option.type}
                    option={option}
                    isSelected={selectedRoutine === option.type}
                    onPress={() => setRoutine(option.type)}
                    isDark={isDark}
                    teal={TEAL}
                    borderDef={borderDef}
                    theme={theme}
                  />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>

        <View
          style={[
            styles.counter,
            {
              borderTopColor: isDark ? "rgba(46,207,190,0.12)" : theme.border,
            },
          ]}
        >
          <Text
            style={{
              fontSize: token.typography.body,
              fontWeight: "500",
              color: hasSelection ? TEAL : subColor,
            }}
          >
            {hasSelection ? "1 rutina seleccionada" : ""}
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    marginBottom: token.spacing.lg,
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
  grid: { gap: token.spacing.md },
  row: { flexDirection: "row", gap: COLUMN_GAP },
  counter: {
    paddingVertical: token.spacing.sm,
    alignItems: "center",
    borderTopWidth: 1,
    marginTop: token.spacing.xs,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTopLine: {
    height: 2,
    width: "70%",
    alignSelf: "center",
    opacity: 0.7,
    borderRadius: 1,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    backgroundColor: "#111",
  },
  image: { width: "100%", height: "100%" },
  imageFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: { ...StyleSheet.absoluteFillObject },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 2,
  },
  title: { fontSize: 14, fontWeight: "700", letterSpacing: 0.3 },
  subtitle: { fontSize: 11, lineHeight: 15 },
});

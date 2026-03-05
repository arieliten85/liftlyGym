// src/feature/onboarding/screens/MuscleGroupScreen.tsx

import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import {
  CATEGORY_OPTIONS,
  CategoryIssue,
  CategoryOption,
  evaluateCategoryCompatibility,
  hasCategoryBlockingError,
  resolveMusclesFromCategories,
} from "@/utils/trainingCategoryRules";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Mapa de imágenes por ID de categoría ───────────────────────────────────
const CATEGORY_IMAGES: Record<string, ImageSourcePropType> = {
  fullbody: require("@/assets/category-routine/fullbody.png"),
  legs: require("@/assets/category-routine/leg.png"),
  lower: require("@/assets/category-routine/lower.png"),
  pull: require("@/assets/category-routine/pull.png"),
  push: require("@/assets/category-routine/push.png"),
  upper: require("@/assets/category-routine/upper.png"),
};

// ─── Severity colors / icons ─────────────────────────────────────────────────
const SEVERITY_COLOR = {
  error: "#EF4444",
  warning: "#EAB308",
} as const;

const SEVERITY_ICON = {
  error: "close-circle-outline",
  warning: "warning-outline",
} as const;

// ─── IssueCard ────────────────────────────────────────────────────────────────
function IssueCard({
  issue,
  isDark,
}: {
  issue: CategoryIssue;
  isDark: boolean;
}) {
  const color = SEVERITY_COLOR[issue.severity];
  const bg = isDark
    ? issue.severity === "error"
      ? "rgba(239,68,68,0.08)"
      : "rgba(234,179,8,0.08)"
    : issue.severity === "error"
      ? "rgba(239,68,68,0.06)"
      : "rgba(234,179,8,0.06)";
  const border = isDark
    ? issue.severity === "error"
      ? "rgba(239,68,68,0.35)"
      : "rgba(234,179,8,0.35)"
    : issue.severity === "error"
      ? "rgba(239,68,68,0.25)"
      : "rgba(234,179,8,0.25)";

  return (
    <View
      style={[issueStyles.card, { backgroundColor: bg, borderColor: border }]}
    >
      <View style={[issueStyles.accentBar, { backgroundColor: color }]} />
      <View style={issueStyles.inner}>
        <View style={issueStyles.titleRow}>
          <Ionicons
            name={SEVERITY_ICON[issue.severity] as any}
            size={15}
            color={color}
          />
          <Text style={[issueStyles.title, { color }]}>{issue.title}</Text>
        </View>
        <Text
          style={[issueStyles.message, { color: isDark ? "#C9C9C9" : "#555" }]}
        >
          {issue.message}
        </Text>
      </View>
    </View>
  );
}

const issueStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden",
  },
  accentBar: { width: 3 },
  inner: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 5 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { fontSize: 13, fontWeight: "700", letterSpacing: 0.2 },
  message: { fontSize: 12, lineHeight: 17 },
});

// ─── CategoryCard (2 columnas con imagen) ────────────────────────────────────
function CategoryCard({
  option,
  isSelected,
  onPress,
  isDark,
  teal,
  borderDef,
  theme,
}: {
  option: CategoryOption;
  isSelected: boolean;
  onPress: () => void;
  isDark: boolean;
  teal: string;
  borderDef: string;
  theme: any;
}) {
  const image = CATEGORY_IMAGES[option.id];

  const borderSel = isDark ? "rgba(46,207,190,0.6)" : teal;
  const cardBgFallback = isDark ? "#0C1119" : theme.colors.card;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        cardStyles.card,
        {
          borderColor: isSelected ? borderSel : borderDef,
          shadowColor: isSelected ? teal : "transparent",
          backgroundColor: cardBgFallback,
        },
      ]}
    >
      {/* Selected top accent line */}
      {isSelected && (
        <View style={[cardStyles.cardTopLine, { backgroundColor: teal }]} />
      )}

      {/* Image area */}
      <View style={cardStyles.imageContainer}>
        {image ? (
          <Image
            source={image}
            style={cardStyles.image}
            resizeMode="cover"
          />
        ) : (
          // Fallback si no existe la imagen
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
            <Ionicons
              name={option.icon as any}
              size={32}
              color={isSelected ? teal : isDark ? "#4A6A66" : theme.colors.textSecondary}
            />
          </View>
        )}

        {/* Overlay degradado sobre la imagen */}
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

        {/* Check badge */}
        {isSelected && (
          <View style={[cardStyles.checkBadge, { backgroundColor: teal }]}>
            <Ionicons name="checkmark" size={10} color="#fff" />
          </View>
        )}
      </View>

      {/* Footer con título y subtítulo */}
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
                : theme.colors.card,
            borderTopColor: isSelected
              ? isDark
                ? "rgba(46,207,190,0.25)"
                : "rgba(46,207,190,0.35)"
              : isDark
                ? "rgba(255,255,255,0.05)"
                : theme.colors.border,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            cardStyles.title,
            { color: isSelected ? teal : isDark ? "#DFF0EE" : theme.colors.text },
          ]}
        >
          {option.label}
        </Text>
        <Text
          numberOfLines={2}
          style={[
            cardStyles.subtitle,
            { color: isDark ? (isSelected ? "#B8D4D0" : "#4A6A66") : theme.colors.textSecondary },
          ]}
        >
          {option.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    // El ancho se controla desde el grid container (≈50% - gap)
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
    aspectRatio: 1.1, // cuadrada casi cuadrada
    position: "relative",
    backgroundColor: "#111",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
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
  title: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
});

// ─── Screen principal ─────────────────────────────────────────────────────────
export default function MuscleGroupScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();

  const selectedCategories = useOnboardingStore((s) => s.trainingCategories);
  const setTrainingCategory = useOnboardingStore((s) => s.setTrainingCategory);
  const setMuscleGroups = useOnboardingStore((s) => s.setMuscleGroups);

  const issues = useMemo(
    () => evaluateCategoryCompatibility(selectedCategories),
    [selectedCategories],
  );
  const blocked =
    selectedCategories.length === 0 || hasCategoryBlockingError(issues);

  const handleNext = () => {
    if (blocked) return;
    const muscles = resolveMusclesFromCategories(selectedCategories);
    setMuscleGroups(muscles);
    router.push("/confirmRoutine");
  };

  const TEAL = theme.colors.primary;
  const textColor = isDark ? "#DFF0EE" : theme.colors.text;
  const subColor = isDark ? "#4A6A66" : theme.colors.textSecondary;
  const borderDef = isDark ? "rgba(46,207,190,0.15)" : theme.colors.border;

  return (
    <OnboardingLayout
      title="Tipo de rutina"
      onNext={handleNext}
      isNextDisabled={blocked}
      nextButtonText="Continuar"
    >
      <View style={styles.container}>
        {/* Particles (dark only) */}
        {isDark &&
          [...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.particle,
                {
                  top: `${(i * 25 + 4) % 88}%` as any,
                  left: `${(i * 37 + 6) % 84}%` as any,
                  opacity: 0.05 + (i % 4) * 0.04,
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                },
              ]}
            />
          ))}

        {/* Section header */}
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            ¿Cómo querés entrenar hoy?
          </Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Elegí el tipo de sesión.
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: token.spacing.xl }}
          showsVerticalScrollIndicator={false}
        >
          {/* Grid de 2 columnas */}
          <View style={styles.grid}>
            {CATEGORY_OPTIONS.map((option) => (
              <View key={option.id} style={styles.gridItem}>
                <CategoryCard
                  option={option}
                  isSelected={selectedCategories.includes(option.id)}
                  onPress={() => setTrainingCategory(option.id)}
                  isDark={isDark}
                  teal={TEAL}
                  borderDef={borderDef}
                  theme={theme}
                />
              </View>
            ))}
          </View>

          {issues.length > 0 && (
            <View
              style={{ gap: token.spacing.sm, marginTop: token.spacing.md }}
            >
              {issues.map((issue) => (
                <IssueCard key={issue.code} issue={issue} isDark={isDark} />
              ))}
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.counter,
            {
              borderTopColor: isDark
                ? "rgba(46,207,190,0.12)"
                : theme.colors.border,
            },
          ]}
        >
          <Text
            style={{
              fontSize: token.typography.body,
              fontWeight: "500",
              color: selectedCategories.length > 0 ? TEAL : subColor,
            }}
          >
            {selectedCategories.length > 0 ? "1 categoría seleccionada" : ""}
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
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
  // ── Grid 2 columnas ──
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: token.spacing.md,
  },
  gridItem: {
    // 2 columnas: (100% - 1 gap) / 2
    width: `${(100 - 4) / 2}%` as any, // aprox 48%
    // Si token.spacing.md es un número fijo podés hacer esto más preciso:
    // width: (Dimensions.get("window").width - padding*2 - gap) / 2
  },
  counter: {
    paddingVertical: token.spacing.sm,
    alignItems: "center",
    borderTopWidth: 1,
    marginTop: token.spacing.xs,
  },
});

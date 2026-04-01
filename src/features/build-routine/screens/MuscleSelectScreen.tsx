import {
  MUSCLE_OPTION_DATA,
  QUICK_OPTION_DATA,
} from "@/features/build-routine/constants/routine-builder.constants";
import { ROUTINE_IMAGES } from "@/features/build-routine/constants/routine-images.constants";
import {
  DaySessionType,
  RoutineCustomType,
  RoutineQuickType,
} from "@/types/routine";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";

import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
const MAX_SELECTION = 2;

const COMBOS_PROHIBIDOS: [RoutineCustomType, RoutineCustomType][] = [
  ["pecho", "espalda"],
  ["pecho", "piernas"],
  ["espalda", "piernas"],
  ["hombros", "pecho"],
  ["biceps", "triceps"],
];

const QUICK_SET = new Set<string>([
  "push",
  "pull",
  "legs",
  "upper",
  "lower",
  "fullbody",
]);

function isQuickType(t: DaySessionType): t is RoutineQuickType {
  return QUICK_SET.has(t);
}

function isCompatible(
  selected: DaySessionType[],
  candidate: DaySessionType,
): boolean {
  if (isQuickType(candidate)) return selected.length === 0;
  if (selected.some(isQuickType)) return false;
  for (const s of selected) {
    if (isQuickType(s)) return false;
    const prohibido = COMBOS_PROHIBIDOS.some(
      ([a, b]) => (a === s && b === candidate) || (a === candidate && b === s),
    );
    if (prohibido) return false;
  }
  return true;
}

function SelectionCard({
  title,
  subtitle,
  image,
  icon,
  isSelected,
  isDisabled,
  onPress,
  isDark,
  teal,
  borderDef,
  theme,
}: {
  title: string;
  subtitle?: string;
  image?: any;
  icon?: string;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
  isDark: boolean;
  teal: string;
  borderDef: string;
  theme: any;
}) {
  const borderSel = isDark ? "rgba(46,207,190,0.6)" : teal;
  const cardBg = isDark ? "#0C1119" : theme.card;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isDisabled ? 1 : 0.8}
      disabled={isDisabled}
      style={[
        cardStyles.card,
        {
          width: CARD_WIDTH,
          borderColor: isSelected ? borderSel : borderDef,
          shadowColor: isSelected ? teal : "transparent",
          backgroundColor: cardBg,
          opacity: isDisabled ? 0.35 : 1,
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
            {icon && (
              <Ionicons
                name={icon as any}
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
        {isDisabled && !isSelected && (
          <View style={cardStyles.disabledBadge}>
            <Ionicons name="close" size={10} color="#fff" />
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
              : cardBg,
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
            { color: isSelected ? teal : isDark ? "#DFF0EE" : theme.text },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
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
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function SectionHeader({
  label,
  subColor,
  isDark,
  theme,
}: {
  label: string;
  subColor: string;
  isDark: boolean;
  theme: any;
}) {
  const lineColor = isDark ? "rgba(46,207,190,0.2)" : theme.border;
  return (
    <View style={sh.row}>
      <View style={[sh.line, { backgroundColor: lineColor }]} />
      <Text style={[sh.label, { color: subColor }]}>{label}</Text>
      <View style={[sh.line, { backgroundColor: lineColor }]} />
    </View>
  );
}

export default function MuscleSelectScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const musculos = useBuildRoutineStore((s) => s.musculos);
  const setMusculos = useBuildRoutineStore((s) => s.setMusculos);

  const TEAL = theme.primary;
  const textColor = isDark ? "#DFF0EE" : theme.text;
  const subColor = isDark ? "#4A6A66" : theme.textSecondary;
  const borderDef = isDark ? "rgba(46,207,190,0.15)" : theme.border;

  const handleToggle = (type: DaySessionType) => {
    if (musculos.includes(type)) {
      setMusculos(musculos.filter((m) => m !== type));
      return;
    }
    if (musculos.length >= MAX_SELECTION) return;
    if (!isCompatible(musculos, type)) return;
    setMusculos([...musculos, type]);
  };

  const handleNext = () => {
    if (!musculos.length) return;
    router.push(
      `/(onboarding)/(build-routine)/confirmCustom?from=${from ?? "tabs"}`,
    );
  };

  const quickRows: (typeof QUICK_OPTION_DATA)[] = [];
  for (let i = 0; i < QUICK_OPTION_DATA.length; i += 2)
    quickRows.push(QUICK_OPTION_DATA.slice(i, i + 2));

  const muscleRows: (typeof MUSCLE_OPTION_DATA)[] = [];
  for (let i = 0; i < MUSCLE_OPTION_DATA.length; i += 2)
    muscleRows.push(MUSCLE_OPTION_DATA.slice(i, i + 2));

  const comboLabel = musculos.map((m) => m.toUpperCase()).join(" + ");

  return (
    <OnboardingLayout
      title="Elegí tu sesión"
      onNext={handleNext}
      isNextDisabled={musculos.length === 0}
      nextButtonText="Continuar"
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            ¿Qué vas a trabajar hoy?
          </Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Elegí un tipo de rutina o hasta 2 grupos musculares compatibles
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SectionHeader
            label="TIPOS DE RUTINA"
            subColor={subColor}
            isDark={isDark}
            theme={theme}
          />
          <View style={styles.grid}>
            {quickRows.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((opt) => {
                  const isSel = musculos.includes(opt.type);
                  const isDisabled =
                    !isSel && !isCompatible(musculos, opt.type);
                  return (
                    <SelectionCard
                      key={opt.type}
                      title={opt.label}
                      subtitle={opt.subtitle}
                      image={opt.image ?? ROUTINE_IMAGES[opt.type]}
                      icon={opt.icon}
                      isSelected={isSel}
                      isDisabled={isDisabled}
                      onPress={() => handleToggle(opt.type)}
                      isDark={isDark}
                      teal={TEAL}
                      borderDef={borderDef}
                      theme={theme}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          <SectionHeader
            label="GRUPOS MUSCULARES"
            subColor={subColor}
            isDark={isDark}
            theme={theme}
          />
          <View style={styles.grid}>
            {muscleRows.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((opt) => {
                  const isSel = musculos.includes(opt.type);
                  const isDisabled =
                    !isSel &&
                    (musculos.length >= MAX_SELECTION ||
                      !isCompatible(musculos, opt.type));
                  return (
                    <SelectionCard
                      key={opt.type}
                      title={opt.title}
                      image={opt.image}
                      isSelected={isSel}
                      isDisabled={isDisabled}
                      onPress={() => handleToggle(opt.type)}
                      isDark={isDark}
                      teal={TEAL}
                      borderDef={borderDef}
                      theme={theme}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>

        <View
          style={[
            styles.counter,
            { borderTopColor: isDark ? "rgba(46,207,190,0.12)" : theme.border },
          ]}
        >
          {musculos.length > 0 ? (
            <View style={styles.counterRow}>
              <Ionicons name="checkmark-circle" size={14} color={TEAL} />
              <Text style={[styles.counterText, { color: TEAL }]}>
                {comboLabel}
              </Text>
            </View>
          ) : (
            <Text style={[styles.counterText, { color: subColor }]}>
              Nada seleccionado
            </Text>
          )}
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
  scrollContent: { gap: token.spacing.lg, paddingBottom: token.spacing.xl },
  grid: { gap: token.spacing.md },
  row: { flexDirection: "row", gap: COLUMN_GAP },
  counter: {
    paddingVertical: token.spacing.sm,
    alignItems: "center",
    borderTopWidth: 1,
    marginTop: token.spacing.xs,
  },
  counterRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  counterText: { fontSize: token.typography.body, fontWeight: "600" },
});

const sh = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  line: { flex: 1, height: 1, opacity: 0.5 },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
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
  disabledBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(150,50,50,0.7)",
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

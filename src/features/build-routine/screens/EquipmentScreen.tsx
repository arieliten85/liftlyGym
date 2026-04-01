import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { EquipmentType } from "@/types/routine";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EQUIPAMENTE_OPTION_DATA } from "../constants/routine-builder.constants";

const EQUIPMENT_META: Record<EquipmentType, { tag: string; pills: string[] }> =
  {
    gym: { tag: "Acceso completo", pills: ["Pesas", "Máquinas", "Cables"] },
    dumbbells: { tag: "Equipamiento básico", pills: ["Mancuernas", "Banco"] },
    basic: { tag: "Mínimo equipo", pills: ["Barra", "Mancuernas", "Bandas"] },
    bodyweight: { tag: "Sin equipo", pills: ["Cuerpo", "Bandas"] },
  };

export default function EquipmentScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const selected = useBuildRoutineStore((s) => s.equipment);
  const setEquipment = useBuildRoutineStore((s) => s.setEquipment);

  const handleNext = () => {
    if (selected)
      router.push(`/(onboarding)/(build-routine)/experience?from=${from}`);
  };

  const TEAL = theme.primary;
  const textColor = isDark ? "#DFF0EE" : theme.text;
  const subColor = isDark ? "#4A6A66" : theme.textSecondary;

  return (
    <OnboardingLayout
      title="Equipamiento"
      onNext={handleNext}
      isNextDisabled={!selected}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            ¿Dónde entrenás?
          </Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Seleccioná el equipamiento disponible para personalizar tu plan
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.cardList}
          showsVerticalScrollIndicator={false}
        >
          {EQUIPAMENTE_OPTION_DATA.map((option) => {
            const isSelected = selected === option.type;
            const meta = EQUIPMENT_META[option.type];

            const cardBg = isSelected
              ? isDark
                ? "#0D2420"
                : "#EBF9F7"
              : isDark
                ? "#0C1614"
                : theme.card;

            const borderColor = isSelected
              ? isDark
                ? "rgba(46,207,190,0.55)"
                : TEAL
              : isDark
                ? "#1C3330"
                : theme.border;

            const fadeColors: [string, string, string] = isSelected
              ? isDark
                ? ["#0D2420", "rgba(13,36,32,0.82)", "rgba(13,36,32,0.0)"]
                : ["#EBF9F7", "rgba(235,249,247,0.82)", "rgba(235,249,247,0.0)"]
              : isDark
                ? ["#0C1614", "rgba(12,22,20,0.82)", "rgba(12,22,20,0.0)"]
                : [theme.card, `${theme.card}D0`, `${theme.card}00`];

            const tagColor = isSelected ? TEAL : subColor;
            const titleColor = isSelected ? TEAL : textColor;
            const descColor = isSelected
              ? isDark
                ? "#8ECFC8"
                : "#2A8C80"
              : subColor;
            const pillBorder = isSelected
              ? isDark
                ? "rgba(46,207,190,0.28)"
                : "rgba(46,207,190,0.45)"
              : isDark
                ? "#1C3330"
                : theme.border;
            const pillText = isSelected
              ? isDark
                ? "#5DCAA5"
                : "#0F6E56"
              : subColor;
            const imgOpacity = isSelected ? 0.65 : 0.35;

            return (
              <TouchableOpacity
                key={option.type}
                onPress={() => setEquipment(option.type)}
                activeOpacity={0.82}
                style={[
                  styles.card,
                  {
                    backgroundColor: cardBg,
                    borderColor,
                    shadowColor: isSelected ? TEAL : "transparent",
                  },
                ]}
              >
                {isSelected && (
                  <View style={[styles.topLine, { backgroundColor: TEAL }]} />
                )}

                <Image
                  source={option.image}
                  style={[styles.bgImage, { opacity: imgOpacity }]}
                  resizeMode="cover"
                />

                <LinearGradient
                  colors={fadeColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject}
                />

                <View style={styles.content}>
                  <View style={styles.tagRow}>
                    <View
                      style={[styles.tagDot, { backgroundColor: tagColor }]}
                    />
                    <Text style={[styles.tagLabel, { color: tagColor }]}>
                      {meta.tag}
                    </Text>
                  </View>

                  <Text style={[styles.cardTitle, { color: titleColor }]}>
                    {option.title}
                  </Text>

                  {/* ← descripción eliminada */}

                  <View style={styles.pillsRow}>
                    {meta.pills.map((p) => (
                      <View
                        key={p}
                        style={[styles.pill, { borderColor: pillBorder }]}
                      >
                        <Text style={[styles.pillText, { color: pillText }]}>
                          {p}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: TEAL }]}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerContainer: {
    marginBottom: token.spacing.sm,
  },
  sectionTitle: {
    fontSize: token.typography.h2,
    fontWeight: "bold",
    marginBottom: token.spacing.xs / 2,
  },
  sectionSubtitle: {
    fontSize: token.typography.bodySmall,
    lineHeight: 20,
  },

  cardList: {
    gap: token.spacing.md,
    paddingBottom: token.spacing.xl,
  },

  card: {
    height: 110, // era 130
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },

  topLine: {
    position: "absolute",
    top: 0,
    left: "15%",
    right: "35%",
    height: 2,
    borderRadius: 1,
    opacity: 0.85,
    zIndex: 10,
  },

  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 6, // más espacio entre los 3 elementos
    zIndex: 2,
  },

  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 0, // gap del content ya lo maneja
  },
  tagDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  tagLabel: {
    fontSize: 9, // era 10
    fontWeight: "800",
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },

  cardTitle: {
    fontSize: 20, // un poco más grande ahora que hay espacio
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  cardDesc: {
    fontSize: 11, // era 12
    lineHeight: 15, // era 17
    maxWidth: "60%",
  },

  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 0, // gap del content ya lo maneja
  },
  pill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 7, // era 9
    paddingVertical: 2, // era 3
  },
  pillText: {
    fontSize: 9, // era 10
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  checkBadge: {
    position: "absolute",
    top: 12,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

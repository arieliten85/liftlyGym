import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

export interface WorkoutSurveyPayload {
  intensity: number; // 1–5
  energy: number; // 1–5
  soreness: number; // 1–5
  comment: string;
  completedAt: string;
  durationMinutes: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  wasAbandoned: boolean;
}

interface WorkoutSummaryModalProps {
  visible: boolean;
  colors: ThemeColors;
  isDark: boolean;
  durationMinutes: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  wasAbandoned: boolean;
  onSubmit: (payload: WorkoutSurveyPayload) => void;
  onClose: () => void;
}

const RATINGS: { emoji: string; label: string }[][] = [
  // intensity
  [
    { emoji: "🧘", label: "Muy suave" },
    { emoji: "🚶", label: "Suave" },
    { emoji: "🏃", label: "Moderado" },
    { emoji: "💪", label: "Intenso" },
    { emoji: "🔥", label: "Al límite" },
  ],
  // energy
  [
    { emoji: "😴", label: "Sin energía" },
    { emoji: "😐", label: "Bajo" },
    { emoji: "🙂", label: "Normal" },
    { emoji: "😄", label: "Con energía" },
    { emoji: "⚡", label: "Con todo" },
  ],
  // soreness
  [
    { emoji: "✅", label: "Sin dolor" },
    { emoji: "🟡", label: "Leve" },
    { emoji: "🟠", label: "Moderado" },
    { emoji: "🔴", label: "Fuerte" },
    { emoji: "🆘", label: "Muy fuerte" },
  ],
];

function EmojiRating({
  title,
  ratings,
  value,
  onChange,
  colors,
  isDark,
  accentColor,
}: {
  title: string;
  ratings: { emoji: string; label: string }[];
  value: number;
  onChange: (v: number) => void;
  colors: ThemeColors;
  isDark: boolean;
  accentColor: string;
}) {
  return (
    <View style={er.wrap}>
      <View style={er.titleRow}>
        <Text style={[er.title, { color: colors.textPrimary }]}>{title}</Text>
        {value > 0 && (
          <Text style={[er.selected, { color: accentColor }]}>
            {ratings[value - 1].label}
          </Text>
        )}
      </View>
      <View style={er.row}>
        {ratings.map((item, i) => {
          const n = i + 1;
          const active = n === value;
          return (
            <TouchableOpacity
              key={n}
              onPress={() => onChange(n)}
              activeOpacity={0.7}
              style={[
                er.btn,
                {
                  backgroundColor: active
                    ? accentColor + "20"
                    : isDark
                      ? "#1A1A1A"
                      : "#F0F0F0",
                  borderColor: active ? accentColor : "transparent",
                  transform: [{ scale: active ? 1.12 : 1 }],
                },
              ]}
            >
              <Text style={er.emoji}>{item.emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const er = StyleSheet.create({
  wrap: { gap: 12 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 15, fontWeight: "700" },
  selected: { fontSize: 13, fontWeight: "600" },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 56,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 24 },
});

function AnimatedStat({
  value,
  label,
  suffix = "",
  color,
  colors,
  delay = 0,
}: {
  value: number;
  label: string;
  suffix?: string;
  color: string;
  colors: ThemeColors;
  delay?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(anim, {
        toValue: value,
        duration: 900,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    const id = anim.addListener(({ value: v }) => setDisplayed(Math.round(v)));
    return () => anim.removeListener(id);
  }, []);

  return (
    <View style={as.wrap}>
      <View
        style={[
          as.circle,
          { borderColor: color + "30", backgroundColor: color + "10" },
        ]}
      >
        <Text style={[as.num, { color }]}>
          {displayed}
          {suffix}
        </Text>
      </View>
      <Text style={[as.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const as = StyleSheet.create({
  wrap: { alignItems: "center", gap: 8, flex: 1 },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  num: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  label: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});

export function WorkoutSummaryModal({
  visible,
  colors,
  isDark,
  durationMinutes,
  exercisesCompleted,
  exercisesTotal,
  wasAbandoned,
  onSubmit,
  onClose,
}: WorkoutSummaryModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [intensity, setIntensity] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [soreness, setSoreness] = useState(0);
  const [comment, setComment] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const heroScale = useRef(new Animated.Value(0.6)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;

  const completionPct =
    exercisesTotal > 0
      ? Math.round((exercisesCompleted / exercisesTotal) * 100)
      : 0;

  // Reset on open
  useEffect(() => {
    if (visible) {
      setStep(1);
      setIntensity(0);
      setEnergy(0);
      setSoreness(0);
      setComment("");
      heroScale.setValue(0.6);
      heroOpacity.setValue(0);
      // Hero entrance animation
      Animated.parallel([
        Animated.spring(heroScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 7,
        }),
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const goToSurvey = () => {
    Animated.timing(slideAnim, {
      toValue: -1,
      duration: 280,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start(() => {
      setStep(2);
      slideAnim.setValue(1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    });
  };

  const canSubmit = intensity > 0 && energy > 0 && soreness > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(btnScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(2)),
      }),
    ]).start(() => {
      onSubmit({
        intensity,
        energy,
        soreness,
        comment: comment.trim(),
        completedAt: new Date().toISOString(),
        durationMinutes,
        exercisesCompleted,
        exercisesTotal,
        wasAbandoned,
      });
    });
  };

  const isGoodResult = completionPct >= 80 && !wasAbandoned;
  const heroEmoji = wasAbandoned
    ? "🚪"
    : completionPct === 100
      ? "🏆"
      : completionPct >= 50
        ? "💪"
        : "🌱";
  const heroTitle = wasAbandoned
    ? "Rutina abandonada"
    : completionPct === 100
      ? "¡Rutina completada!"
      : `${completionPct}% completado`;
  const heroSub = wasAbandoned
    ? "Está bien, lo que hiciste cuenta. ¡La próxima vas con todo!"
    : completionPct === 100
      ? "¡Excelente trabajo! Terminaste cada ejercicio."
      : `Completaste ${exercisesCompleted} de ${exercisesTotal} ejercicios.`;

  const accentIntensity = isDark ? "#F87171" : "#DC2626";
  const accentEnergy = isDark ? "#34D399" : "#059669";
  const accentSoreness = isDark ? "#FB923C" : "#EA580C";

  const slideTranslate = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-340, 0, 340],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[m.safe, { backgroundColor: colors.bg }]}>
        {/* ─── HEADER ─── */}
        <View style={m.header}>
          {step === 2 ? (
            <TouchableOpacity
              onPress={() => setStep(1)}
              activeOpacity={0.7}
              style={[
                m.iconBtn,
                { backgroundColor: isDark ? "#1E1E1E" : "#F0F0F0" },
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}

          {/* Step indicators */}
          <View style={m.steps}>
            <View style={[m.stepDot, { backgroundColor: colors.primary }]} />
            <View
              style={[
                m.stepDot,
                {
                  backgroundColor: step === 2 ? colors.primary : colors.border,
                  width: step === 2 ? 24 : 8,
                },
              ]}
            />
          </View>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={[
              m.iconBtn,
              { backgroundColor: isDark ? "#1E1E1E" : "#F0F0F0" },
            ]}
          >
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ─── ANIMATED CONTENT ─── */}
        <Animated.View
          style={[{ flex: 1, transform: [{ translateX: slideTranslate }] }]}
        >
          {/* ══ STEP 1: RESULT ══ */}
          {step === 1 && (
            <ScrollView
              contentContainerStyle={m.scroll}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* Hero */}
              <Animated.View
                style={[
                  m.hero,
                  { transform: [{ scale: heroScale }], opacity: heroOpacity },
                ]}
              >
                <View
                  style={[
                    m.heroCircle,
                    {
                      backgroundColor:
                        (wasAbandoned ? "#64748B" : colors.primary) + "15",
                      borderColor:
                        (wasAbandoned ? "#64748B" : colors.primary) + "30",
                    },
                  ]}
                >
                  <Text style={m.heroEmoji}>{heroEmoji}</Text>
                </View>
                <Text style={[m.heroTitle, { color: colors.textPrimary }]}>
                  {heroTitle}
                </Text>
                <Text style={[m.heroSub, { color: colors.textSecondary }]}>
                  {heroSub}
                </Text>
              </Animated.View>

              {/* Stats */}
              <View
                style={[
                  m.statsCard,
                  {
                    backgroundColor: isDark ? "#141414" : "#F7F7F7",
                    borderColor: isDark ? "#232323" : "#EBEBEB",
                  },
                ]}
              >
                <AnimatedStat
                  value={durationMinutes}
                  suffix="m"
                  label="Duración"
                  color={colors.primary}
                  colors={colors}
                  delay={200}
                />
                <View
                  style={[m.statsDivider, { backgroundColor: colors.border }]}
                />
                <AnimatedStat
                  value={exercisesCompleted}
                  label="Ejercicios"
                  color={accentEnergy}
                  colors={colors}
                  delay={350}
                />
                <View
                  style={[m.statsDivider, { backgroundColor: colors.border }]}
                />
                <AnimatedStat
                  value={completionPct}
                  suffix="%"
                  label="Completado"
                  color={accentIntensity}
                  colors={colors}
                  delay={500}
                />
              </View>

              {/* Motivational tip */}
              <View
                style={[
                  m.tipCard,
                  {
                    backgroundColor: colors.primary + "0A",
                    borderColor: colors.primary + "20",
                  },
                ]}
              >
                <Ionicons name="sparkles" size={16} color={colors.primary} />
                <Text style={[m.tipText, { color: colors.textSecondary }]}>
                  {wasAbandoned
                    ? "La IA ajustará tu próxima rutina para que sea más alcanzable."
                    : isGoodResult
                      ? "¡Gran trabajo! La constancia es la clave del progreso."
                      : "Cada entrenamiento te acerca a tu objetivo, seguí así."}
                </Text>
              </View>

              {/* CTA to survey */}
              <TouchableOpacity
                onPress={goToSurvey}
                activeOpacity={0.86}
                style={[m.ctaBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={m.ctaText}>Contar cómo me fue</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>

              {/* Skip option */}
              <TouchableOpacity
                onPress={() =>
                  onSubmit({
                    intensity: 0,
                    energy: 0,
                    soreness: 0,
                    comment: "",
                    completedAt: new Date().toISOString(),
                    durationMinutes,
                    exercisesCompleted,
                    exercisesTotal,
                    wasAbandoned,
                  })
                }
                activeOpacity={0.7}
                style={m.skipBtn}
              >
                <Text style={[m.skipText, { color: colors.textSecondary }]}>
                  Saltar encuesta
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* ══ STEP 2: SURVEY ══ */}
          {step === 2 && (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              >
                <ScrollView
                  contentContainerStyle={m.scroll}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={m.surveyIntro}>
                    <Text
                      style={[m.surveyTitle, { color: colors.textPrimary }]}
                    >
                      ¿Cómo te sentiste? 💬
                    </Text>
                    <Text
                      style={[m.surveySub, { color: colors.textSecondary }]}
                    >
                      Tu respuesta ayuda a la IA a personalizar tu próxima
                      sesión
                    </Text>
                  </View>

                  {/* Rating cards */}
                  <View
                    style={[
                      m.ratingCard,
                      {
                        backgroundColor: isDark ? "#141414" : "#F7F7F7",
                        borderColor: isDark ? "#232323" : "#EBEBEB",
                      },
                    ]}
                  >
                    <EmojiRating
                      title="💪 Intensidad del entrenamiento"
                      ratings={RATINGS[0]}
                      value={intensity}
                      onChange={setIntensity}
                      colors={colors}
                      isDark={isDark}
                      accentColor={accentIntensity}
                    />
                  </View>

                  <View
                    style={[
                      m.ratingCard,
                      {
                        backgroundColor: isDark ? "#141414" : "#F7F7F7",
                        borderColor: isDark ? "#232323" : "#EBEBEB",
                      },
                    ]}
                  >
                    <EmojiRating
                      title="⚡ Energía al terminar"
                      ratings={RATINGS[1]}
                      value={energy}
                      onChange={setEnergy}
                      colors={colors}
                      isDark={isDark}
                      accentColor={accentEnergy}
                    />
                  </View>

                  <View
                    style={[
                      m.ratingCard,
                      {
                        backgroundColor: isDark ? "#141414" : "#F7F7F7",
                        borderColor: isDark ? "#232323" : "#EBEBEB",
                      },
                    ]}
                  >
                    <EmojiRating
                      title="🩹 Dolor / molestias"
                      ratings={RATINGS[2]}
                      value={soreness}
                      onChange={setSoreness}
                      colors={colors}
                      isDark={isDark}
                      accentColor={accentSoreness}
                    />
                  </View>

                  {/* Comment */}
                  <View
                    style={[
                      m.ratingCard,
                      {
                        backgroundColor: isDark ? "#141414" : "#F7F7F7",
                        borderColor: isDark ? "#232323" : "#EBEBEB",
                      },
                    ]}
                  >
                    <Text
                      style={[m.commentLabel, { color: colors.textPrimary }]}
                    >
                      📝 Algo que quieras recordar{" "}
                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontWeight: "500",
                        }}
                      >
                        (opcional)
                      </Text>
                    </Text>
                    <TextInput
                      style={[
                        m.commentInput,
                        {
                          backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                          borderColor: isDark ? "#2A2A2A" : "#E0E0E0",
                          color: colors.textPrimary,
                        },
                      ]}
                      placeholder="Ej: el hombro me molestó un poco, subir peso en press..."
                      placeholderTextColor={colors.textSecondary}
                      value={comment}
                      onChangeText={setComment}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                </ScrollView>

                {/* Footer */}
                <View
                  style={[
                    m.footer,
                    { borderTopColor: isDark ? "#1E1E1E" : "#F0F0F0" },
                  ]}
                >
                  {!canSubmit && (
                    <Text style={[m.hint, { color: colors.textSecondary }]}>
                      Seleccioná las 3 valoraciones para continuar
                    </Text>
                  )}
                  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      activeOpacity={0.86}
                      style={[
                        m.ctaBtn,
                        {
                          backgroundColor: canSubmit
                            ? colors.primary
                            : isDark
                              ? "#252525"
                              : "#E5E5E5",
                        },
                      ]}
                    >
                      <Ionicons
                        name="checkmark-done-circle"
                        size={22}
                        color={canSubmit ? "#fff" : colors.textSecondary}
                      />
                      <Text
                        style={[
                          m.ctaText,
                          { color: canSubmit ? "#fff" : colors.textSecondary },
                        ]}
                      >
                        Guardar y terminar
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          )}
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
}

const m = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  steps: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },

  scroll: {
    padding: 24,
    paddingBottom: 32,
    gap: 18,
  },

  // Step 1 hero
  hero: {
    alignItems: "center",
    gap: 14,
    paddingVertical: 8,
  },
  heroCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  heroEmoji: { fontSize: 52 },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
  },

  // Stats card
  statsCard: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statsDivider: { width: 1, height: 60, marginHorizontal: 4 },

  // Tip
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipText: { flex: 1, fontSize: 14, fontWeight: "500", lineHeight: 20 },

  // CTA
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  skipBtn: { alignItems: "center", paddingVertical: 4 },
  skipText: { fontSize: 14, fontWeight: "500" },

  // Step 2 survey
  surveyIntro: { gap: 6 },
  surveyTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -0.3 },
  surveySub: { fontSize: 14, fontWeight: "500", lineHeight: 20 },

  ratingCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },

  commentLabel: { fontSize: 15, fontWeight: "700", marginBottom: 10 },
  commentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 88,
  },

  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
    borderTopWidth: 1,
    gap: 8,
  },
  hint: { fontSize: 12, fontWeight: "500", textAlign: "center" },
});

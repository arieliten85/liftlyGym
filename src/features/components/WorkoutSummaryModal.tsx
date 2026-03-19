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
  intensity: number;
  energy: number;
  painLevel: number;
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

const INTENSITY_LABELS = [
  "Muy suave",
  "Suave",
  "Moderado",
  "Intenso",
  "Al límite",
];
const ENERGY_LABELS = ["Agotado", "Bajo", "Normal", "Bien", "Excelente"];
const SORENESS_LABELS = [
  "Sin molestias",
  "Leve",
  "Moderado",
  "Fuerte",
  "Muy fuerte",
];

// ─── ScaleSelector ────────────────────────────────────────────────────────────

function ScaleSelector({
  label,
  sublabel,
  value,
  onChange,
  accent,
  labels,
  colors,
  isDark,
}: {
  label: string;
  sublabel: string;
  value: number;
  onChange: (v: number) => void;
  accent: string;
  labels: string[];
  colors: ThemeColors;
  isDark: boolean;
}) {
  const barHeights = [20, 32, 44, 56, 68];
  return (
    <View style={sc.wrap}>
      <View style={sc.labelRow}>
        <View>
          <Text style={[sc.label, { color: colors.textPrimary }]}>{label}</Text>
          <Text style={[sc.sublabel, { color: colors.textSecondary }]}>
            {sublabel}
          </Text>
        </View>
        {value > 0 && (
          <View
            style={[
              sc.valuePill,
              { backgroundColor: accent + "18", borderColor: accent + "35" },
            ]}
          >
            <Text style={[sc.valueText, { color: accent }]}>
              {labels[value - 1]}
            </Text>
          </View>
        )}
      </View>
      <View style={sc.barsRow}>
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= value;
          const selected = n === value;
          return (
            <TouchableOpacity
              key={n}
              onPress={() => onChange(n)}
              activeOpacity={0.7}
              style={[sc.barWrap, { height: barHeights[n - 1] + 16 }]}
            >
              <Animated.View
                style={[
                  sc.bar,
                  {
                    height: barHeights[n - 1],
                    backgroundColor: active
                      ? accent
                      : isDark
                        ? "#252525"
                        : "#E8E8E8",
                    borderRadius: 4,
                    transform: [{ scaleY: selected ? 1.05 : 1 }],
                    shadowColor: active ? accent : "transparent",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: selected ? 0.45 : 0,
                    shadowRadius: 6,
                    elevation: selected ? 4 : 0,
                  },
                ]}
              />
              <Text
                style={[
                  sc.barNum,
                  {
                    color: active ? accent : colors.textSecondary,
                    opacity: active ? 1 : 0.4,
                  },
                ]}
              >
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const sc = StyleSheet.create({
  wrap: { gap: 16 },
  labelRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  label: { fontSize: 15, fontWeight: "700", letterSpacing: -0.2 },
  sublabel: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  valuePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  valueText: { fontSize: 12, fontWeight: "700" },
  barsRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  barWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  bar: { width: "100%" },
  barNum: { fontSize: 11, fontWeight: "700" },
});

// ─── StatBlock ────────────────────────────────────────────────────────────────

function StatBlock({
  value,
  suffix,
  label,
  accent,
  colors,
  delay,
}: {
  value: number;
  suffix?: string;
  label: string;
  accent: string;
  colors: ThemeColors;
  delay?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(anim, {
        toValue: value,
        duration: 800,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }).start();
    }, delay ?? 0);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const id = anim.addListener(({ value: v }) => setDisplayed(Math.round(v)));
    return () => anim.removeListener(id);
  }, []);

  return (
    <View style={sb.wrap}>
      <Text style={[sb.num, { color: colors.textPrimary }]}>
        {displayed}
        <Text style={[sb.suffix, { color: accent }]}>{suffix}</Text>
      </Text>
      <Text style={[sb.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[sb.line, { backgroundColor: accent }]} />
    </View>
  );
}

const sb = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", gap: 6 },
  num: { fontSize: 40, fontWeight: "900", letterSpacing: -2, lineHeight: 44 },
  suffix: { fontSize: 20, fontWeight: "700", letterSpacing: -1 },
  label: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  line: { height: 2, width: 24, borderRadius: 1 },
});

// ─── WorkoutSummaryModal ──────────────────────────────────────────────────────

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

  // ✅ Ref local para evitar doble tap antes de que el padre cierre el modal
  const submittedRef = useRef(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  const completionPct =
    exercisesTotal > 0
      ? Math.round((exercisesCompleted / exercisesTotal) * 100)
      : 0;

  useEffect(() => {
    if (visible) {
      // Reset al abrir
      setStep(1);
      setIntensity(0);
      setEnergy(0);
      setSoreness(0);
      setComment("");
      submittedRef.current = false;
      headerAnim.setValue(0);
      statsAnim.setValue(0);

      Animated.stagger(120, [
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(statsAnim, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    }
  }, [visible]);

  const goToSurvey = () => {
    Animated.timing(slideAnim, {
      toValue: -1,
      duration: 260,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start(() => {
      setStep(2);
      slideAnim.setValue(1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    });
  };

  const canSubmit = intensity > 0 && energy > 0 && soreness > 0;

  // ✅ Un solo helper que incluye el guard contra doble tap
  const fireSubmit = (overrides?: Partial<WorkoutSurveyPayload>) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmit({
      intensity,
      energy,
      painLevel: soreness,
      comment: comment.trim(),
      completedAt: new Date().toISOString(),
      durationMinutes,
      exercisesCompleted,
      exercisesTotal,
      wasAbandoned,
      ...overrides,
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.95,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(btnScale, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(2)),
      }),
    ]).start(() => fireSubmit());
  };

  const handleSkip = () => {
    fireSubmit({ intensity: 0, energy: 0, painLevel: 0, comment: "" });
  };

  const slideTranslate = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-360, 0, 360],
  });

  const accentIntensity = isDark ? "#F87171" : "#DC2626";
  const accentEnergy = colors.primary;
  const accentSoreness = isDark ? "#FB923C" : "#EA580C";

  const resultLabel = wasAbandoned
    ? "SESIÓN INCOMPLETA"
    : completionPct === 100
      ? "SESIÓN COMPLETADA"
      : `${completionPct}% COMPLETADO`;

  const resultSub = wasAbandoned
    ? `${exercisesCompleted} de ${exercisesTotal} ejercicios realizados`
    : completionPct === 100
      ? `${exercisesTotal} ejercicios · ${durationMinutes} min`
      : `${exercisesCompleted} de ${exercisesTotal} ejercicios realizados`;

  const resultColor = wasAbandoned
    ? isDark
      ? "#94A3B8"
      : "#64748B"
    : completionPct === 100
      ? isDark
        ? "#34D399"
        : "#059669"
      : colors.primary;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[m.safe, { backgroundColor: colors.bg }]}>
        {/* Header */}
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
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
          <View style={m.stepIndicator}>
            <View style={[m.stepDot, { backgroundColor: colors.primary }]} />
            <View
              style={[
                m.stepDot,
                {
                  backgroundColor: step === 2 ? colors.primary : colors.border,
                  width: step === 2 ? 20 : 8,
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
            <Ionicons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={{ flex: 1, transform: [{ translateX: slideTranslate }] }}
        >
          {/* ══ STEP 1: RESUMEN ══ */}
          {step === 1 && (
            <ScrollView
              contentContainerStyle={m.scroll}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Animated.View
                style={[
                  m.resultBlock,
                  {
                    opacity: headerAnim,
                    transform: [
                      {
                        translateY: headerAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [16, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[m.statusBar, { backgroundColor: resultColor }]} />
                <Text style={[m.resultLabel, { color: resultColor }]}>
                  {resultLabel}
                </Text>
                <Text style={[m.resultSub, { color: colors.textSecondary }]}>
                  {resultSub}
                </Text>
              </Animated.View>

              <Animated.View
                style={[
                  m.statsRow,
                  {
                    backgroundColor: isDark ? "#111" : "#F5F5F5",
                    borderColor: isDark ? "#1E1E1E" : "#E8E8E8",
                    opacity: statsAnim,
                    transform: [
                      {
                        translateY: statsAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <StatBlock
                  value={durationMinutes}
                  suffix="m"
                  label="Duración"
                  accent={colors.primary}
                  colors={colors}
                  delay={180}
                />
                <View
                  style={[
                    m.statsDivider,
                    { backgroundColor: isDark ? "#1E1E1E" : "#E8E8E8" },
                  ]}
                />
                <StatBlock
                  value={exercisesCompleted}
                  label="Ejercicios"
                  accent={accentEnergy}
                  colors={colors}
                  delay={300}
                />
                <View
                  style={[
                    m.statsDivider,
                    { backgroundColor: isDark ? "#1E1E1E" : "#E8E8E8" },
                  ]}
                />
                <StatBlock
                  value={completionPct}
                  suffix="%"
                  label="Completado"
                  accent={accentIntensity}
                  colors={colors}
                  delay={420}
                />
              </Animated.View>

              <Text
                style={[
                  m.contextNote,
                  { color: colors.textSecondary, borderLeftColor: resultColor },
                ]}
              >
                {wasAbandoned
                  ? "La IA ajustará la próxima sesión en base a lo que registraste hoy."
                  : completionPct === 100
                    ? "Datos completos registrados. La IA analizará el rendimiento para la próxima rutina."
                    : "La IA usará estos datos para optimizar la progresión en la próxima sesión."}
              </Text>

              <TouchableOpacity
                onPress={goToSurvey}
                activeOpacity={0.86}
                style={[m.ctaBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={m.ctaText}>Registrar percepción del esfuerzo</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSkip}
                activeOpacity={0.7}
                style={m.skipBtn}
              >
                <Text style={[m.skipText, { color: colors.textSecondary }]}>
                  Omitir
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* ══ STEP 2: ENCUESTA RPE ══ */}
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
                      Percepción del esfuerzo
                    </Text>
                    <Text
                      style={[m.surveySub, { color: colors.textSecondary }]}
                    >
                      3 métricas clave · menos de 30 segundos
                    </Text>
                  </View>

                  <View
                    style={[
                      m.dividerRow,
                      { borderTopColor: isDark ? "#1E1E1E" : "#EBEBEB" },
                    ]}
                  >
                    <Text
                      style={[m.dividerLabel, { color: colors.textSecondary }]}
                    >
                      RPE — Escala 1 al 5
                    </Text>
                  </View>

                  <View
                    style={[
                      m.metricCard,
                      {
                        backgroundColor: isDark ? "#111" : "#FAFAFA",
                        borderColor: isDark ? "#1E1E1E" : "#EBEBEB",
                      },
                    ]}
                  >
                    <ScaleSelector
                      label="Intensidad"
                      sublabel="¿Qué tan duro fue el entrenamiento?"
                      value={intensity}
                      onChange={setIntensity}
                      accent={accentIntensity}
                      labels={INTENSITY_LABELS}
                      colors={colors}
                      isDark={isDark}
                    />
                  </View>

                  <View
                    style={[
                      m.metricCard,
                      {
                        backgroundColor: isDark ? "#111" : "#FAFAFA",
                        borderColor: isDark ? "#1E1E1E" : "#EBEBEB",
                      },
                    ]}
                  >
                    <ScaleSelector
                      label="Energía al terminar"
                      sublabel="¿Cómo quedaste al finalizar?"
                      value={energy}
                      onChange={setEnergy}
                      accent={accentEnergy}
                      labels={ENERGY_LABELS}
                      colors={colors}
                      isDark={isDark}
                    />
                  </View>

                  <View
                    style={[
                      m.metricCard,
                      {
                        backgroundColor: isDark ? "#111" : "#FAFAFA",
                        borderColor: isDark ? "#1E1E1E" : "#EBEBEB",
                      },
                    ]}
                  >
                    <ScaleSelector
                      label="Dolor / molestias"
                      sublabel="Dolor muscular o articular durante la sesión"
                      value={soreness}
                      onChange={setSoreness}
                      accent={accentSoreness}
                      labels={SORENESS_LABELS}
                      colors={colors}
                      isDark={isDark}
                    />
                  </View>

                  <View style={m.commentBlock}>
                    <Text
                      style={[m.commentLabel, { color: colors.textPrimary }]}
                    >
                      Observaciones
                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontWeight: "500",
                        }}
                      >
                        {" "}
                        (opcional)
                      </Text>
                    </Text>
                    <TextInput
                      style={[
                        m.commentInput,
                        {
                          backgroundColor: isDark ? "#111" : "#FAFAFA",
                          borderColor: isDark ? "#1E1E1E" : "#E0E0E0",
                          color: colors.textPrimary,
                        },
                      ]}
                      placeholder="Molestias específicas, notas de progresión, ajustes sugeridos..."
                      placeholderTextColor={colors.textSecondary}
                      value={comment}
                      onChangeText={setComment}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                </ScrollView>

                <View
                  style={[
                    m.footer,
                    {
                      borderTopColor: isDark ? "#1E1E1E" : "#F0F0F0",
                      backgroundColor: colors.bg,
                    },
                  ]}
                >
                  {!canSubmit && (
                    <Text style={[m.hint, { color: colors.textSecondary }]}>
                      Completá las 3 métricas para continuar
                    </Text>
                  )}
                  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      activeOpacity={0.86}
                      disabled={!canSubmit}
                      style={[
                        m.ctaBtn,
                        {
                          backgroundColor: canSubmit
                            ? colors.primary
                            : isDark
                              ? "#222"
                              : "#E5E5E5",
                        },
                      ]}
                    >
                      <Ionicons
                        name="checkmark-done-circle"
                        size={20}
                        color={canSubmit ? "#fff" : colors.textSecondary}
                      />
                      <Text
                        style={[
                          m.ctaText,
                          { color: canSubmit ? "#fff" : colors.textSecondary },
                        ]}
                      >
                        Guardar y cerrar sesión
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
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  stepIndicator: { flexDirection: "row", alignItems: "center", gap: 5 },
  stepDot: { height: 7, width: 7, borderRadius: 3.5 },
  scroll: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 36, gap: 20 },
  resultBlock: { gap: 8, paddingTop: 12, paddingBottom: 4 },
  statusBar: { height: 3, width: 40, borderRadius: 2, marginBottom: 4 },
  resultLabel: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.8,
    lineHeight: 32,
  },
  resultSub: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
  statsRow: {
    flexDirection: "row",
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: "flex-end",
  },
  statsDivider: { width: 1, height: 50, marginHorizontal: 4 },
  contextNote: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 20,
    borderLeftWidth: 2,
    paddingLeft: 12,
    color: "#888",
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 17,
    borderRadius: 14,
  },
  ctaText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  skipBtn: { alignItems: "center", paddingVertical: 2 },
  skipText: { fontSize: 13, fontWeight: "500" },
  surveyIntro: { gap: 4, paddingTop: 8 },
  surveyTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  surveySub: { fontSize: 13, fontWeight: "500" },
  dividerRow: { borderTopWidth: 1, paddingTop: 14 },
  dividerLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  metricCard: { borderRadius: 16, borderWidth: 1, padding: 18 },
  commentBlock: { gap: 10 },
  commentLabel: { fontSize: 14, fontWeight: "700" },
  commentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 84,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
    borderTopWidth: 1,
    gap: 8,
  },
  hint: { fontSize: 12, fontWeight: "500", textAlign: "center" },
});

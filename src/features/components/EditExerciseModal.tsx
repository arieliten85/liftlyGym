import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { ExerciseProgress, RoutineExercise } from "@/type/routine.type";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
  useWindowDimensions,
} from "react-native";
import {
  formatRest,
  formatRestTime,
} from "../build-routine/utils/formatRestTime";

interface ThemeColors {
  surface: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  border: string;
  bg: string;
}

interface EditExerciseModalProps {
  visible: boolean;
  exercise: RoutineExercise | null;
  progress: ExerciseProgress | null;
  colors: ThemeColors;
  isDark: boolean;
  onClose: () => void;
  onUpdateProgress: (updates: Partial<ExerciseProgress>) => void;
  formatTextTitle: (text: string) => string;
}

interface StepperProps {
  label: string;
  value: number;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  colors: ThemeColors;
  isDark: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  compact?: boolean;
}

function Stepper({
  label,
  value,
  unit = "",
  step = 1,
  min = 0,
  max = 999,
  onChange,
  colors,
  isDark,
  icon,
  accent,
  compact = false,
}: StepperProps) {
  const { width } = useWindowDimensions();
  const isSmall = width < 375;

  const btnSize = compact ? (isSmall ? 36 : 42) : isSmall ? 44 : 50;
  const iconSize = compact ? (isSmall ? 16 : 18) : isSmall ? 20 : 22;
  const valueFontSize = compact ? (isSmall ? 18 : 22) : isSmall ? 26 : 30;
  const unitFontSize = compact ? (isSmall ? 10 : 12) : isSmall ? 13 : 15;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 130,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(3)),
      }),
    ]).start();
  };

  const decrement = useCallback(() => {
    if (value - step >= min) {
      pulse();
      onChange(value - step);
      if (Platform.OS !== "web") Vibration.vibrate(8);
    }
  }, [value, step, min, onChange]);

  const increment = useCallback(() => {
    if (value + step <= max) {
      pulse();
      onChange(value + step);
      if (Platform.OS !== "web") Vibration.vibrate(8);
    }
  }, [value, step, max, onChange]);

  const display =
    unit === "kg"
      ? value === 0
        ? "—"
        : `${value}`
      : unit === "s"
        ? formatRest(value)
        : `${value}`;

  return (
    <View
      style={[
        sty.stepWrap,
        {
          backgroundColor: isDark ? "#141414" : "#F5F5F5",
          borderColor: isDark ? "#252525" : "#E5E5E5",
        },
      ]}
    >
      <View style={sty.stepHeader}>
        <View style={[sty.stepIconDot, { backgroundColor: accent + "20" }]}>
          <Ionicons name={icon} size={14} color={accent} />
        </View>
        <Text
          style={[sty.stepLabel, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>

      <View style={sty.stepControls}>
        <TouchableOpacity
          onPress={decrement}
          activeOpacity={0.7}
          style={[
            sty.stepBtn,
            {
              backgroundColor: accent + "15",
              borderColor: accent + "35",
              width: btnSize,
              height: btnSize,
              borderRadius: compact ? 10 : 14,
            },
          ]}
        >
          <Ionicons name="remove" size={iconSize} color={accent} />
        </TouchableOpacity>

        <Animated.View
          style={[sty.stepValueWrap, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text
            style={[
              sty.stepValue,
              { color: colors.textPrimary, fontSize: valueFontSize },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {display}
          </Text>
          {unit !== "s" && unit !== "" && value !== 0 && (
            <Text
              style={[
                sty.stepUnit,
                {
                  color: accent,
                  fontSize: unitFontSize,
                  marginTop: compact ? 2 : 4,
                },
              ]}
            >
              {unit}
            </Text>
          )}
        </Animated.View>

        <TouchableOpacity
          onPress={increment}
          activeOpacity={0.7}
          style={[
            sty.stepBtn,
            {
              backgroundColor: accent + "15",
              borderColor: accent + "35",
              width: btnSize,
              height: btnSize,
              borderRadius: compact ? 10 : 14,
            },
          ]}
        >
          <Ionicons name="add" size={iconSize} color={accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryChip({
  icon,
  label,
  value,
  color,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  colors: ThemeColors;
}) {
  return (
    <View style={sty.summChip}>
      <Ionicons name={icon} size={15} color={color} />
      <Text style={[sty.summLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[sty.summValue, { color: colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

export function EditExerciseModal({
  visible,
  exercise,
  progress,
  colors,
  isDark,
  onClose,
  onUpdateProgress,
  formatTextTitle,
}: EditExerciseModalProps) {
   const [reps, setReps] = useState(10);
   const [weight, setWeight] = useState(0);
   const [restSeconds, setRestSeconds] = useState(60);
   const [sets, setSets] = useState(3);

  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Sync in from store when modal opens
  useEffect(() => {
    if (visible && progress && exercise) {
      setReps(
        parseInt(progress.editedReps, 10) || parseInt(exercise.reps, 10) || 10,
      );
      setWeight(progress.editedWeight ?? 0);
      setRestSeconds(progress.editedRestSeconds ?? exercise.restSeconds ?? 60);
      setSets(progress.editedSets ?? exercise.sets ?? 3);

      slideAnim.setValue(40);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!exercise || !progress) return null;

  const repAccent = colors.primary;
  const weightAccent = isDark ? "#F59E0B" : "#D97706";
  const restAccent = isDark ? "#34D399" : "#059669";

   const handleSave = () => {
     onUpdateProgress({
       editedReps: reps.toString(),
       editedWeight: weight,
       editedRestSeconds: restSeconds,
       editedSets: sets,
     });
     onClose();
   };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[sty.safe, { backgroundColor: colors.bg }]}>
        {/* ── Header ── */}
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

          <Text style={[sty.headerTitle, { color: colors.textPrimary }]}>
            Editar ejercicio
          </Text>

          <View style={{ width: 40 }} />
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <ScrollView
                contentContainerStyle={sty.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Exercise name */}
                <View style={sty.nameBlock}>
                  <Text
                    style={[sty.exerciseName, { color: colors.textPrimary }]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {formatTextTitle(exercise.name)}
                  </Text>
                  <Text style={[sty.subtitle, { color: colors.textSecondary }]}>
                    Los cambios se aplican desde la próxima serie
                  </Text>
                </View>

                 {/* Current values summary */}
                 <View
                   style={[
                     sty.summaryRow,
                     {
                       backgroundColor: colors.primary + "0C",
                       borderColor: colors.primary + "22",
                     },
                   ]}
                 >
                   <SummaryChip
                     icon="list"
                     label="Series"
                     value={`${sets}`}
                     color={colors.primary}
                     colors={colors}
                   />
                   <View
                     style={[sty.summDiv, { backgroundColor: colors.border }]}
                   />
                   <SummaryChip
                     icon="repeat"
                     label="Reps"
                     value={`${reps}`}
                     color={repAccent}
                     colors={colors}
                   />
                   <View
                     style={[sty.summDiv, { backgroundColor: colors.border }]}
                   />
                   <SummaryChip
                     icon="barbell-outline"
                     label="Peso"
                     value={weight === 0 ? "Sin peso" : `${weight}kg`}
                     color={weightAccent}
                     colors={colors}
                   />
                   <View
                     style={[sty.summDiv, { backgroundColor: colors.border }]}
                   />
                   <SummaryChip
                     icon="time-outline"
                     label="Descanso"
                     value={formatRestTime(restSeconds)}
                     color={restAccent}
                     colors={colors}
                   />
                 </View>

                {/* Sets + Reps + Weight — 3 cols */}
                <View style={sty.steppersTop}>
                  <View style={sty.stepperCol}>
                    <Stepper
                      label="Series"
                      icon="list"
                      value={sets}
                      min={1}
                      max={20}
                      step={1}
                      onChange={setSets}
                      colors={colors}
                      isDark={isDark}
                      accent={colors.primary}
                      compact
                    />
                  </View>
                  <View style={sty.stepperCol}>
                    <Stepper
                      label="Repeticiones"
                      icon="repeat"
                      value={reps}
                      min={1}
                      max={99}
                      step={1}
                      onChange={setReps}
                      colors={colors}
                      isDark={isDark}
                      accent={repAccent}
                      compact
                    />
                  </View>
                  <View style={sty.stepperCol}>
                    <Stepper
                      label="Peso"
                      icon="barbell-outline"
                      value={weight}
                      unit="kg"
                      min={0}
                      max={500}
                      step={2.5}
                      onChange={setWeight}
                      colors={colors}
                      isDark={isDark}
                      accent={weightAccent}
                      compact
                    />
                  </View>
                </View>

                {/* Rest — full width */}
                <Stepper
                  label="Descanso"
                  icon="time-outline"
                  value={restSeconds}
                  unit="s"
                  min={15}
                  max={600}
                  step={15}
                  onChange={setRestSeconds}
                  colors={colors}
                  isDark={isDark}
                  accent={restAccent}
                />

                {/* Rest presets */}
                <View style={sty.presetsBlock}>
                  <Text
                    style={[sty.presetsTitle, { color: colors.textSecondary }]}
                  >
                    Descanso rápido
                  </Text>
                  <View style={sty.presetsRow}>
                    {[30, 60, 90, 120, 180].map((s) => (
                      <TouchableOpacity
                        key={s}
                        onPress={() => setRestSeconds(s)}
                        activeOpacity={0.7}
                        style={[
                          sty.preset,
                          restSeconds === s
                            ? {
                                backgroundColor: restAccent,
                                borderColor: restAccent,
                              }
                            : {
                                backgroundColor: isDark ? "#1A1A1A" : "#EFEFEF",
                                borderColor: isDark ? "#2A2A2A" : "#E0E0E0",
                              },
                        ]}
                      >
                        <Text
                          style={[
                            sty.presetText,
                            {
                              color:
                                restSeconds === s
                                  ? "#fff"
                                  : colors.textSecondary,
                              fontWeight: restSeconds === s ? "700" : "500",
                            },
                          ]}
                        >
                          {formatRestTime(s)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Footer */}
              <View
                style={[
                  sty.footer,
                  { borderTopColor: isDark ? "#1E1E1E" : "#EFEFEF" },
                ]}
              >
                <PrimaryButton
                  label="Guardar cambios"
                  iconLeft="checkmark-circle"
                  onPress={handleSave}
                />
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 24,
    gap: 16,
  },

  nameBlock: { gap: 4 },
  exerciseName: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
  },

  summaryRow: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  summChip: { flex: 1, alignItems: "center", gap: 4 },
  summDiv: { width: 1, height: 32 },
  summLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  summValue: { fontSize: 14, fontWeight: "700" },

   steppersTop: {
     gap: 16,
   },
   stepperCol: { width: '100%' },

  stepWrap: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    justifyContent: "space-between",
  },
  stepHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  stepIconDot: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  stepControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepBtn: {
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  stepValueWrap: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 3,
  },
  stepValue: { fontWeight: "800", letterSpacing: -1 },
  stepUnit: { fontWeight: "700" },

  presetsBlock: { gap: 9 },
  presetsTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  presetsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  preset: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetText: { fontSize: 13 },

  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
    borderTopWidth: 1,
  },
});

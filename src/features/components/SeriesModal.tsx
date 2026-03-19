import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { ExerciseProgress, RoutineExercise } from "@/type/routine.type";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

interface SeriesModalProps {
  visible: boolean;
  exercise: RoutineExercise | null;
  progress: ExerciseProgress | null;
  colors: ThemeColors;
  isDark: boolean;
  onClose: () => void;
  onLogSet: (log: {
    repsCompleted: number | null;
    weight: number | null;
    skipped: boolean;
  }) => void;
  onUpdateTotalSets: (total: number) => void;
  onUpdateDisplayValues: (
    values: Partial<ExerciseProgress["displayValues"]>,
  ) => void;
  formatTextTitle: (text: string) => string;
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

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
  isModified?: boolean;
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
  isModified = false,
}: StepperProps) {
  const { width } = useWindowDimensions();
  const isSmall = width < 375;
  const btnSize = compact ? (isSmall ? 34 : 38) : isSmall ? 40 : 46;
  const iconSize = compact ? (isSmall ? 15 : 17) : isSmall ? 17 : 20;
  const valueFontSize = compact ? (isSmall ? 18 : 21) : isSmall ? 22 : 26;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pulse = () =>
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.86,
        duration: 65,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(3)),
      }),
    ]).start();

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
          borderColor: isModified
            ? accent + "60"
            : isDark
              ? "#252525"
              : "#E5E5E5",
          borderWidth: isModified ? 1.5 : 1,
        },
      ]}
    >
      <View style={sty.stepHeader}>
        <View style={[sty.stepIconDot, { backgroundColor: accent + "20" }]}>
          <Ionicons name={icon} size={12} color={accent} />
        </View>
        <Text
          style={[sty.stepLabel, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {isModified && (
          <View style={[sty.modDot, { backgroundColor: accent }]} />
        )}
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
              borderRadius: compact ? 10 : 12,
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
              {
                color: isModified ? accent : colors.textPrimary,
                fontSize: valueFontSize,
              },
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
                { color: accent, fontSize: compact ? 11 : 12 },
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
              borderRadius: compact ? 10 : 12,
            },
          ]}
        >
          <Ionicons name="add" size={iconSize} color={accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── LiveSummaryBar ───────────────────────────────────────────────────────────

function LiveSummaryBar({
  reps,
  weight,
  restSeconds,
  sets,
  plannedReps,
  plannedWeight,
  plannedRest,
  plannedSets,
  colors,
  isDark,
}: {
  reps: number;
  weight: number;
  restSeconds: number;
  sets: number;
  plannedReps: string;
  plannedWeight: number;
  plannedRest: number;
  plannedSets: number;
  colors: ThemeColors;
  isDark: boolean;
}) {
  const repAccent = colors.primary;
  const weightAccent = isDark ? "#F59E0B" : "#D97706";
  const restAccent = isDark ? "#34D399" : "#059669";
  const setsAccent = isDark ? "#A78BFA" : "#7C3AED";

  const items = [
    {
      icon: "repeat" as const,
      label: "reps",
      value: `${reps}`,
      accent: repAccent,
      changed: reps.toString() !== plannedReps,
    },
    {
      icon: "barbell-outline" as const,
      label: "peso",
      value: weight === 0 ? "—" : `${weight}kg`,
      accent: weightAccent,
      changed: weight !== plannedWeight,
    },
    {
      icon: "time-outline" as const,
      label: "descanso",
      value: formatRest(restSeconds),
      accent: restAccent,
      changed: restSeconds !== plannedRest,
    },
    {
      icon: "layers-outline" as const,
      label: "series",
      value: `${sets}`,
      accent: setsAccent,
      changed: sets !== plannedSets,
    },
  ];

  return (
    <View
      style={[
        sty.liveBar,
        {
          backgroundColor: isDark ? "#141414" : "#F7F7F7",
          borderColor: isDark ? "#232323" : "#E8E8E8",
        },
      ]}
    >
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && (
            <View
              style={[sty.liveDivider, { backgroundColor: colors.border }]}
            />
          )}
          <View style={sty.liveItem}>
            {item.changed && (
              <View style={[sty.changedDot, { backgroundColor: "#F59E0B" }]} />
            )}
            <View
              style={[
                sty.liveIconWrap,
                { backgroundColor: item.accent + "18" },
              ]}
            >
              <Ionicons name={item.icon} size={14} color={item.accent} />
            </View>
            <Text
              style={[
                sty.liveValue,
                { color: item.changed ? item.accent : colors.textPrimary },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
            >
              {item.value}
            </Text>
            <Text style={[sty.liveLabel, { color: colors.textSecondary }]}>
              {item.label}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── SetDots ──────────────────────────────────────────────────────────────────

function SetDots({
  current,
  total,
  primary,
  isDark,
  skippedSets,
}: {
  current: number;
  total: number;
  primary: string;
  isDark: boolean;
  skippedSets: number[];
}) {
  const maxDots = 10;
  const visible = Math.min(total, maxDots);
  const overflow = total > maxDots ? total - maxDots : 0;

  return (
    <View style={sty.dotsRow}>
      {Array.from({ length: visible }).map((_, i) => {
        const setNum = i + 1;
        const skipped = skippedSets.includes(setNum);
        const done = setNum < current && !skipped;
        const active = setNum === current;
        return (
          <View
            key={i}
            style={[
              sty.dot,
              { backgroundColor: isDark ? "#2A2A2A" : "#E0E0E0" },
              skipped && { backgroundColor: "#EF444450" },
              done && { backgroundColor: primary + "70" },
              active && {
                backgroundColor: primary,
                width: 28,
                borderRadius: 5,
              },
            ]}
          />
        );
      })}
      {overflow > 0 && (
        <Text style={[sty.dotsOverflow, { color: primary }]}>+{overflow}</Text>
      )}
    </View>
  );
}

// ─── RestCountdown ────────────────────────────────────────────────────────────

function RestCountdown({
  seconds,
  isLastSet,
  colors,
  isDark,
  primary,
  onSkip,
  onFinish,
}: {
  seconds: number;
  isLastSet: boolean;
  colors: ThemeColors;
  isDark: boolean;
  primary: string;
  onSkip: () => void;
  onFinish: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    finishedRef.current = false;
    setRemaining(seconds);
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 950,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    );
    pulse.start();
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          if (!finishedRef.current) {
            finishedRef.current = true;
            if (Platform.OS !== "web") Vibration.vibrate([0, 120, 80, 120]);
            setTimeout(onFinish, 400);
          }
          return 0;
        }
        if (prev <= 4 && Platform.OS !== "web") Vibration.vibrate(25);
        return prev - 1;
      });
    }, 1000);
    return () => {
      pulse.stop();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [seconds]);

  const progress = remaining / seconds;
  const urgentColor =
    remaining <= 5 ? "#EF4444" : remaining <= 10 ? "#F59E0B" : primary;

  return (
    <View
      style={[
        sty.countdownFull,
        { backgroundColor: isDark ? "#0D0D0D" : "#F8F8F8" },
      ]}
    >
      <View
        style={[
          sty.restBadge,
          {
            backgroundColor: urgentColor + "18",
            borderColor: urgentColor + "30",
          },
        ]}
      >
        <Ionicons name="time" size={14} color={urgentColor} />
        <Text style={[sty.restBadgeText, { color: urgentColor }]}>
          {isLastSet ? "EJERCICIO COMPLETADO" : "TIEMPO DE DESCANSO"}
        </Text>
      </View>
      <Animated.View
        style={[sty.circleWrap, { transform: [{ scale: pulseAnim }] }]}
      >
        <View
          style={[
            sty.circleRingBg,
            { borderColor: isDark ? "#222" : "#E8E8E8" },
          ]}
        />
        {Array.from({ length: 24 }).map((_, i) => {
          const active = i / 24 < progress;
          return (
            <View
              key={i}
              style={[sty.segment, { transform: [{ rotate: `${i * 15}deg` }] }]}
            >
              <View
                style={[
                  sty.segBar,
                  {
                    backgroundColor: urgentColor,
                    opacity: active ? 1 : 0.07,
                    height: active ? 20 : 14,
                  },
                ]}
              />
            </View>
          );
        })}
        <View style={sty.circleCenter}>
          <Text style={[sty.countdownNum, { color: colors.textPrimary }]}>
            {remaining}
          </Text>
          <Text style={[sty.countdownSub, { color: colors.textSecondary }]}>
            {remaining === 0 ? "¡Listo!" : "seg"}
          </Text>
        </View>
      </Animated.View>
      <Text style={[sty.restMessage, { color: colors.textSecondary }]}>
        {remaining === 0
          ? isLastSet
            ? "¡Ejercicio completado! 🏆"
            : "¡A la siguiente serie! 💪"
          : remaining <= 5
            ? "¡Preparate! 🔥"
            : isLastSet
              ? "Gran trabajo, último descanso 🎯"
              : "Recuperate, viene la siguiente serie"}
      </Text>
      <TouchableOpacity
        onPress={onSkip}
        activeOpacity={0.7}
        style={[
          sty.skipRestBtn,
          {
            backgroundColor: isDark ? "#1E1E1E" : "#EFEFEF",
            borderColor: isDark ? "#2A2A2A" : "#E0E0E0",
          },
        ]}
      >
        <Text style={[sty.skipRestText, { color: colors.textSecondary }]}>
          Saltar descanso
        </Text>
        <Ionicons
          name="play-skip-forward"
          size={16}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

// ─── SeriesModal ──────────────────────────────────────────────────────────────

type Phase = "active" | "resting";

export function SeriesModal({
  visible,
  exercise,
  progress,
  colors,
  isDark,
  onClose,
  onLogSet,
  onUpdateTotalSets,
  onUpdateDisplayValues,
  formatTextTitle,
}: SeriesModalProps) {
  const { height } = useWindowDimensions();
  const isShortDevice = height < 700;

  const [phase, setPhase] = useState<Phase>("active");
  const [localCurrentSet, setLocalCurrentSet] = useState(1);
  const [skippedSets, setSkippedSets] = useState<number[]>([]);

  const [reps, setRepsLocal] = useState(10);
  const [weight, setWeightLocal] = useState(0);
  const [restSeconds, setRestLocal] = useState(60);
  const [sets, setSetsLocal] = useState(3);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const animateIn = (fromValue = 30) => {
    slideAnim.setValue(fromValue);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (visible && progress && exercise) {
      const dv = progress.displayValues;
      setPhase("active");
      // ✅ Siempre sincronizamos desde el store al abrir el modal
      setLocalCurrentSet(progress.currentSet);
      setSetsLocal(dv.sets);
      setSkippedSets(
        progress.setLogs.filter((l) => l.skipped).map((l) => l.setNumber),
      );
      setRepsLocal(parseInt(dv.reps, 10) || parseInt(exercise.reps, 10) || 10);
      setWeightLocal(dv.weight);
      setRestLocal(dv.restSeconds);
      animateIn();
    }
  }, [visible]);

  if (!exercise || !progress) return null;

  // ✅ La fuente de verdad del total de series es `sets` (estado local sincronizado con el store).
  // `localCurrentSet` se incrementa con cada log pero NUNCA puede superar `sets`.
  const localTotalSets = sets;
  const isLastSet = localCurrentSet >= localTotalSets;

  const plannedReps = exercise.reps;
  const plannedWeight = exercise.weight ?? 0;
  const plannedRest = exercise.restSeconds ?? 60;
  const plannedSets = exercise.sets;

  const repModified = reps.toString() !== plannedReps;
  const weightModified = weight !== plannedWeight;
  const restModified = restSeconds !== plannedRest;
  const setsModified = sets !== plannedSets;

  const weightAccent = isDark ? "#F59E0B" : "#D97706";
  const restAccent = isDark ? "#34D399" : "#059669";
  const setsAccent = isDark ? "#A78BFA" : "#7C3AED";

  const handleRepsChange = (val: number) => {
    setRepsLocal(val);
    onUpdateDisplayValues({ reps: val.toString() });
  };
  const handleWeightChange = (val: number) => {
    setWeightLocal(val);
    onUpdateDisplayValues({ weight: val });
  };
  const handleRestChange = (val: number) => {
    setRestLocal(val);
    onUpdateDisplayValues({ restSeconds: val });
  };
  const handleSetsChange = (val: number) => {
    setSetsLocal(val);
    onUpdateTotalSets(val);
  };

  const handleCompleteSet = () => {
    // ✅ Registrar el log ANTES de avanzar el estado local
    onLogSet({ repsCompleted: reps, weight, skipped: false });

    if (isLastSet) {
      // Última serie completada → ir a descanso (badge "EJERCICIO COMPLETADO")
      setPhase("resting");
    } else {
      setPhase("resting");
    }
  };

  const handleSkipSet = () => {
    // ✅ Registrar el skip
    onLogSet({ repsCompleted: null, weight: null, skipped: true });
    setSkippedSets((prev) => [...prev, localCurrentSet]);

    if (isLastSet) {
      // ✅ Era la última serie → cerrar el modal directamente
      // El store ya marcó completed = true en logSet
      onClose();
    } else {
      setLocalCurrentSet((prev) => prev + 1);
      setPhase("active");
      animateIn(20);
    }
  };

  const handleRestFinished = () => {
    if (isLastSet) {
      // ✅ Última serie descansada → cerrar
      onClose();
    } else {
      setLocalCurrentSet((prev) => prev + 1);
      setPhase("active");
      animateIn(20);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[sty.safe, { backgroundColor: colors.bg }]}>
        {/* Header */}
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
          <View style={[sty.seriesPill, { backgroundColor: colors.primary }]}>
            <Text style={sty.seriesPillText}>
              SERIE {localCurrentSet} / {localTotalSets}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* PHASE: ACTIVE */}
        {phase === "active" && (
          <Animated.View
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <ScrollView
              contentContainerStyle={[
                sty.activeContent,
                isShortDevice && { gap: 10 },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={sty.nameBlock}>
                <Text
                  style={[sty.exerciseName, { color: colors.textPrimary }]}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {formatTextTitle(exercise.name)}
                </Text>
                <Text style={[sty.motivation, { color: colors.textSecondary }]}>
                  {isLastSet
                    ? "¡Último set! Dalo todo 🔥"
                    : "Ajustá si necesitás y completá la serie"}
                </Text>
              </View>

              <SetDots
                current={localCurrentSet}
                total={localTotalSets}
                primary={colors.primary}
                isDark={isDark}
                skippedSets={skippedSets}
              />

              <LiveSummaryBar
                reps={reps}
                weight={weight}
                restSeconds={restSeconds}
                sets={sets}
                plannedReps={plannedReps}
                plannedWeight={plannedWeight}
                plannedRest={plannedRest}
                plannedSets={plannedSets}
                colors={colors}
                isDark={isDark}
              />

              {/* Card: Total de series */}
              <View
                style={[
                  sty.sectionCard,
                  {
                    backgroundColor: isDark ? "#111" : "#FAFAFA",
                    borderColor: isDark ? "#232323" : "#EBEBEB",
                  },
                ]}
              >
                <View style={sty.cardHeader}>
                  <View
                    style={[
                      sty.cardIconDot,
                      { backgroundColor: setsAccent + "20" },
                    ]}
                  >
                    <Ionicons
                      name="layers-outline"
                      size={12}
                      color={setsAccent}
                    />
                  </View>
                  <Text
                    style={[sty.cardTitle, { color: colors.textSecondary }]}
                  >
                    TOTAL DE SERIES
                  </Text>
                  {setsModified && (
                    <View
                      style={[
                        sty.modPill,
                        {
                          backgroundColor: "#F59E0B18",
                          borderColor: "#F59E0B30",
                        },
                      ]}
                    >
                      <Text style={sty.modPillText}>modificado</Text>
                    </View>
                  )}
                </View>
                <Stepper
                  label="Series"
                  icon="layers-outline"
                  value={sets}
                  // ✅ El mínimo es la serie actual: no podés bajar a menos de donde estás
                  min={localCurrentSet}
                  max={20}
                  step={1}
                  onChange={handleSetsChange}
                  colors={colors}
                  isDark={isDark}
                  accent={setsAccent}
                  isModified={setsModified}
                />
              </View>

              {/* Card: Carga */}
              <View
                style={[
                  sty.sectionCard,
                  {
                    backgroundColor: isDark ? "#111" : "#FAFAFA",
                    borderColor: isDark ? "#232323" : "#EBEBEB",
                  },
                ]}
              >
                <View style={sty.cardHeader}>
                  <View
                    style={[
                      sty.cardIconDot,
                      { backgroundColor: colors.primary + "20" },
                    ]}
                  >
                    <Ionicons
                      name="barbell-outline"
                      size={12}
                      color={colors.primary}
                    />
                  </View>
                  <Text
                    style={[sty.cardTitle, { color: colors.textSecondary }]}
                  >
                    CARGA
                  </Text>
                  {(repModified || weightModified) && (
                    <View
                      style={[
                        sty.modPill,
                        {
                          backgroundColor: "#F59E0B18",
                          borderColor: "#F59E0B30",
                        },
                      ]}
                    >
                      <Text style={sty.modPillText}>modificado</Text>
                    </View>
                  )}
                </View>
                <View style={sty.steppersRow}>
                  <View style={{ flex: 1 }}>
                    <Stepper
                      label="Repeticiones"
                      icon="repeat"
                      value={reps}
                      min={1}
                      max={99}
                      step={1}
                      onChange={handleRepsChange}
                      colors={colors}
                      isDark={isDark}
                      accent={colors.primary}
                      compact
                      isModified={repModified}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Stepper
                      label="Peso"
                      icon="barbell-outline"
                      value={weight}
                      unit="kg"
                      min={0}
                      max={500}
                      step={2.5}
                      onChange={handleWeightChange}
                      colors={colors}
                      isDark={isDark}
                      accent={weightAccent}
                      compact
                      isModified={weightModified}
                    />
                  </View>
                </View>
              </View>

              {/* Card: Descanso */}
              <View
                style={[
                  sty.sectionCard,
                  {
                    backgroundColor: isDark ? "#111" : "#FAFAFA",
                    borderColor: isDark ? "#232323" : "#EBEBEB",
                  },
                ]}
              >
                <View style={sty.cardHeader}>
                  <View
                    style={[
                      sty.cardIconDot,
                      { backgroundColor: restAccent + "20" },
                    ]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color={restAccent}
                    />
                  </View>
                  <Text
                    style={[sty.cardTitle, { color: colors.textSecondary }]}
                  >
                    DESCANSO
                  </Text>
                  {restModified && (
                    <View
                      style={[
                        sty.modPill,
                        {
                          backgroundColor: "#F59E0B18",
                          borderColor: "#F59E0B30",
                        },
                      ]}
                    >
                      <Text style={sty.modPillText}>modificado</Text>
                    </View>
                  )}
                </View>
                <Stepper
                  label="Tiempo"
                  icon="time-outline"
                  value={restSeconds}
                  unit="s"
                  min={15}
                  max={600}
                  step={15}
                  onChange={handleRestChange}
                  colors={colors}
                  isDark={isDark}
                  accent={restAccent}
                  isModified={restModified}
                />
                <View style={sty.presetsRow}>
                  {[30, 60, 90, 120, 180].map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => handleRestChange(s)}
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
                              restSeconds === s ? "#fff" : colors.textSecondary,
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
              <TouchableOpacity
                onPress={handleSkipSet}
                activeOpacity={0.75}
                style={[
                  sty.skipSetBtn,
                  { backgroundColor: "#EF444415", borderColor: "#EF444435" },
                ]}
              >
                <Ionicons name="play-skip-forward" size={17} color="#EF4444" />
                <Text style={sty.skipSetText}>
                  Saltear serie {localCurrentSet}
                </Text>
              </TouchableOpacity>
              <PrimaryButton
                label={
                  isLastSet
                    ? "Finalizar ejercicio"
                    : `Completar serie ${localCurrentSet}`
                }
                iconLeft={isLastSet ? "trophy" : "checkmark-circle"}
                onPress={handleCompleteSet}
              />
            </View>
          </Animated.View>
        )}

        {/* PHASE: RESTING */}
        {phase === "resting" && (
          <RestCountdown
            key={`rest-${localCurrentSet}`}
            seconds={restSeconds}
            isLastSet={isLastSet}
            colors={colors}
            isDark={isDark}
            primary={colors.primary}
            onSkip={handleRestFinished}
            onFinish={handleRestFinished}
          />
        )}
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
  seriesPill: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 24 },
  seriesPillText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  activeContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 14,
  },

  nameBlock: { gap: 4 },
  exerciseName: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  motivation: { fontSize: 13, fontWeight: "500" },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    paddingVertical: 2,
  },
  dot: { width: 9, height: 9, borderRadius: 4.5 },
  dotsOverflow: { fontSize: 12, fontWeight: "700", marginLeft: 2 },

  liveBar: {
    flexDirection: "row",
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  liveItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    position: "relative",
    paddingTop: 4,
  },
  liveIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  liveValue: { fontSize: 17, fontWeight: "800", letterSpacing: -0.5 },
  liveLabel: {
    fontSize: 9,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  liveDivider: { width: 1, height: 38, alignSelf: "center" },
  changedDot: {
    position: "absolute",
    top: 0,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  sectionCard: { borderRadius: 18, borderWidth: 1, padding: 14, gap: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  cardIconDot: {
    width: 22,
    height: 22,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    flex: 1,
  },
  modPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  modPillText: { color: "#F59E0B", fontSize: 10, fontWeight: "700" },
  steppersRow: { flexDirection: "row", gap: 10 },

  stepWrap: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
  },
  stepHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  stepIconDot: {
    width: 22,
    height: 22,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    flex: 1,
  },
  modDot: { width: 6, height: 6, borderRadius: 3 },
  stepControls: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepBtn: { borderWidth: 1.5, justifyContent: "center", alignItems: "center" },
  stepValueWrap: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 3,
  },
  stepValue: { fontWeight: "800", letterSpacing: -1 },
  stepUnit: { fontWeight: "700" },

  presetsRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  preset: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 9,
    borderWidth: 1,
  },
  presetText: { fontSize: 12 },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
    borderTopWidth: 1,
    gap: 10,
  },
  skipSetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  skipSetText: { color: "#EF4444", fontSize: 15, fontWeight: "700" },

  countdownFull: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 28,
  },
  restBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  restBadgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  circleWrap: {
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  circleRingBg: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 3,
  },
  segment: {
    position: "absolute",
    width: 240,
    height: 240,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  segBar: { width: 4, borderRadius: 2, marginTop: 4 },
  circleCenter: { alignItems: "center" },
  countdownNum: {
    fontSize: 76,
    fontWeight: "900",
    letterSpacing: -4,
    lineHeight: 84,
  },
  countdownSub: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  restMessage: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
  },
  skipRestBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  skipRestText: { fontSize: 14, fontWeight: "600" },
});

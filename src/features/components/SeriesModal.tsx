import { ExerciseOption, ExerciseService } from "@/services/exerciseService";
import { PrimaryButton } from "@/shared/components/PrimaryButton";
import {
  ExerciseProgress,
  RoutineExercise,
} from "@/types/routine/exercise.type";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomExerciseHeader } from "../build-routine/components/CustomExerciseHeader";
import {
  formatRest,
  formatRestTime,
} from "../build-routine/utils/formatRestTime";
import { getMuscleFromName } from "../build-routine/utils/getMuscleFromName";

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
    restSeconds: number;
  }) => void;
  onUpdateTotalSets: (total: number) => void;
  onUpdateDisplayValues: (
    values: Partial<ExerciseProgress["displayValues"]>,
  ) => void;
  formatTextTitle: (text: string) => string;

  onReplaceExercise?: (newName: string) => void;
}

function BigStepper({
  label,
  value,
  unit = "",
  step = 1,
  min = 0,
  max = 999,
  onChange,
  colors,
  isDark,
  accent,
  isModified = false,
}: {
  label: string;
  value: number;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  colors: ThemeColors;
  isDark: boolean;
  accent: string;
  isModified?: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pulse = () =>
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 60,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 110,
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

  const rawDisplay = `${value}`;
  const charCount = rawDisplay.length;

  const valueFontSize =
    charCount <= 2 ? 28 : charCount <= 3 ? 24 : charCount <= 5 ? 20 : 16;

  return (
    <View
      style={[
        big.wrap,
        {
          backgroundColor: isDark ? "#141414" : "#F5F5F5",
          borderColor: isModified
            ? accent + "70"
            : isDark
              ? "#252525"
              : "#E5E5E5",
          borderWidth: isModified ? 1.5 : 1,
        },
      ]}
    >
      <Text style={[big.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={big.row}>
        <TouchableOpacity
          onPress={decrement}
          activeOpacity={0.7}
          style={[
            big.btn,
            { backgroundColor: accent + "18", borderColor: accent + "35" },
          ]}
        >
          <Ionicons name="remove" size={20} color={accent} />
        </TouchableOpacity>
        <Animated.View
          style={[big.valueWrap, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: valueFontSize,
              fontWeight: "900",
              letterSpacing: -1,
              textAlign: "center",
              includeFontPadding: false,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
          >
            {rawDisplay}
          </Text>
          {unit !== "" && (
            <Text
              style={{ color: accent, fontSize: 12, fontWeight: "700" }}
              numberOfLines={1}
            >
              {unit}
            </Text>
          )}
        </Animated.View>
        <TouchableOpacity
          onPress={increment}
          activeOpacity={0.7}
          style={[
            big.btn,
            { backgroundColor: accent + "18", borderColor: accent + "35" },
          ]}
        >
          <Ionicons name="add" size={20} color={accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const big = StyleSheet.create({
  wrap: {
    flex: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    gap: 6,
    minWidth: 0,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 6,
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  valueWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 0,
    minWidth: 0, // Clave para que el texto se ajuste
  },
  value: {
    fontWeight: "900",
    letterSpacing: -1,
    textAlign: "center",
    flexShrink: 1,
    flex: 1,
    minWidth: 0,
  },
  unit: {
    fontSize: 15,
    fontWeight: "700",
    alignSelf: "flex-end",
    marginBottom: 5,
    flexShrink: 0,
  },
  modBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  modText: { fontSize: 10, fontWeight: "700" },
});

type SetStatus = "pending" | "active" | "done" | "skipped";

function SetHistoryRow({
  setNumber,
  status,
  reps,
  weight,
  restSeconds,
  colors,
  isDark,
  primary,
  onEditRest,
}: {
  setNumber: number;
  status: SetStatus;
  reps?: number;
  weight?: number;
  restSeconds?: number;
  colors: ThemeColors;
  isDark: boolean;
  primary: string;
  onEditRest?: () => void;
}) {
  const isActive = status === "active";
  const restAccent = isDark ? "#34D399" : "#059669";

  // 🎨 Fondo SIEMPRE neutro
  const bg = "transparent";

  // 🎯 Borde (solo destaca el activo)
  const borderColor = isActive ? primary : isDark ? "#1F1F1F" : "#E5E5E5";

  // 🔒 Iconos
  const iconName = isActive ? "radio-button-on" : "lock-closed";

  const iconColor = isActive ? primary : isDark ? "#2A2A2A" : "#CFCFCF";

  return (
    <View style={[hist.row, { backgroundColor: bg, borderColor }]}>
      <Ionicons name={iconName} size={16} color={iconColor} />

      <View style={hist.rowContent}>
        <Text
          style={[
            hist.setLabel,
            {
              color: isActive ? primary : colors.textSecondary,
              opacity: isActive ? 1 : 0.6,
            },
          ]}
        >
          SERIE {String(setNumber).padStart(2, "0")}
        </Text>

        <View style={[hist.metaRow, { opacity: isActive ? 1 : 0.5 }]}>
          {isActive && reps !== undefined && (
            <>
              <View style={hist.metaItem}>
                <Ionicons
                  name="repeat"
                  size={11}
                  color={colors.textSecondary}
                />
                <Text style={[hist.metaText, { color: colors.textSecondary }]}>
                  {reps} reps
                </Text>
              </View>

              {weight !== undefined && (
                <View style={hist.metaItem}>
                  <Ionicons
                    name="barbell-outline"
                    size={11}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[hist.metaText, { color: colors.textSecondary }]}
                  >
                    {weight === 0 ? "—" : `${weight}kg`}
                  </Text>
                </View>
              )}
            </>
          )}

          {restSeconds !== undefined && isActive && (
            <View style={hist.metaItem}>
              <Ionicons name="time-outline" size={11} color={primary} />
              <Text style={[hist.metaText, { color: primary }]}>
                {formatRest(restSeconds)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {isActive && onEditRest && (
        <TouchableOpacity
          onPress={onEditRest}
          activeOpacity={0.7}
          style={[
            hist.restBtn,
            {
              backgroundColor: "transparent",
              borderColor: primary + "30",
            },
          ]}
        >
          <Ionicons name="time-outline" size={16} color={primary} />
        </TouchableOpacity>
      )}

      {isActive && !onEditRest && (
        <View style={[hist.activePill, { backgroundColor: primary }]}>
          <Text style={hist.activePillText}>AHORA</Text>
        </View>
      )}
    </View>
  );
}

const hist = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  rowContent: { flex: 1, gap: 3 },

  setLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  metaText: {
    fontSize: 11,
    fontWeight: "500",
  },

  restBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 0,
  },

  activePillText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});

function SmallStepper({
  label,
  value,
  unit = "",
  step = 1,
  min = 0,
  max = 999,
  onChange,
  colors,
  isDark,
  accent,
}: {
  label: string;
  value: number;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  colors: ThemeColors;
  isDark: boolean;
  accent: string;
}) {
  const display =
    unit === "s"
      ? formatRest(value)
      : unit === "kg"
        ? value === 0
          ? "—"
          : `${value}`
        : `${value}`;

  return (
    <View
      style={[
        sm.wrap,
        {
          backgroundColor: isDark ? "#141414" : "#F5F5F5",
          borderColor: isDark ? "#252525" : "#E5E5E5",
        },
      ]}
    >
      <Text style={[sm.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={sm.row}>
        <TouchableOpacity
          onPress={() => value - step >= min && onChange(value - step)}
          activeOpacity={0.7}
          style={[
            sm.btn,
            { backgroundColor: accent + "15", borderColor: accent + "35" },
          ]}
        >
          <Ionicons name="remove" size={18} color={accent} />
        </TouchableOpacity>
        <Text style={[sm.value, { color: colors.textPrimary }]}>
          {display}
          {unit !== "s" && unit !== "" && value !== 0 ? ` ${unit}` : ""}
        </Text>
        <TouchableOpacity
          onPress={() => value + step <= max && onChange(value + step)}
          activeOpacity={0.7}
          style={[
            sm.btn,
            { backgroundColor: accent + "15", borderColor: accent + "35" },
          ]}
        >
          <Ionicons name="add" size={18} color={accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const sm = StyleSheet.create({
  wrap: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
});

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
  onReplaceExercise,
}: SeriesModalProps) {
  const [phase, setPhase] = useState<Phase>("active");
  const [localCurrentSet, setLocalCurrentSet] = useState(1);
  const [skippedSets, setSkippedSets] = useState<number[]>([]);
  const [doneSets, setDoneSets] = useState<
    { setNum: number; reps: number; weight: number; rest: number }[]
  >([]);
  const [configVisible, setConfigVisible] = useState(false);
  const [restVisible, setRestVisible] = useState(false);

  const [reps, setRepsLocal] = useState(10);
  const [weight, setWeightLocal] = useState(0);
  const [restSeconds, setRestLocal] = useState(60);
  const [sets, setSetsLocal] = useState(3);

  const [exerciseOptions, setExerciseOptions] = useState<ExerciseOption[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const exerciseService = new ExerciseService();

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
    if (!configVisible || !exercise) return;

    const muscle = getMuscleFromName(exercise.name);
    if (!muscle) return;

    setLoadingExercises(true);
    exerciseService
      .getByMuscle(muscle)
      .then((data) =>
        setExerciseOptions(data.filter((e) => e.name !== exercise.name)),
      )
      .catch(console.error)
      .finally(() => setLoadingExercises(false));
  }, [configVisible, exercise]);

  useEffect(() => {
    if (visible && progress && exercise) {
      const dv = progress.displayValues;
      setPhase("active");
      setLocalCurrentSet(progress.currentSet);
      setSetsLocal(dv.sets);
      setSkippedSets(
        progress.setLogs.filter((l) => l.skipped).map((l) => l.setNumber),
      );
      setDoneSets(
        progress.setLogs
          .filter((l) => !l.skipped && l.repsCompleted !== null)
          .map((l) => ({
            setNum: l.setNumber,
            reps: l.repsCompleted!,
            weight: l.weight ?? 0,
            rest: l.restSeconds ?? dv.restSeconds,
          })),
      );
      setRepsLocal(parseInt(dv.reps, 10) || parseInt(exercise.reps, 10) || 10);
      setWeightLocal(dv.weight);
      setRestLocal(dv.restSeconds);
      animateIn();
    }
  }, [visible]);

  useEffect(() => {
    if (configVisible && exercise && !selectedExercise) {
      setSelectedExercise(exercise.name);
    }
  }, [configVisible, exercise]);

  if (!exercise || !progress) return null;

  const localTotalSets = sets;
  const isLastSet = localCurrentSet >= localTotalSets;
  const plannedSets = exercise.sets;
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
    if (val < localCurrentSet) return;
    setSetsLocal(val);
    onUpdateTotalSets(val);
  };

  const handleCompleteSet = () => {
    onLogSet({ repsCompleted: reps, weight, skipped: false, restSeconds });
    setDoneSets((prev) => [
      ...prev,
      { setNum: localCurrentSet, reps, weight, rest: restSeconds },
    ]);
    setPhase("resting");
  };

  const handleSkipSet = () => {
    Alert.alert(
      "¿Saltear esta serie?",
      `La serie ${localCurrentSet} se marcará como salteada.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Saltear",
          style: "destructive",
          onPress: () => {
            onLogSet({
              repsCompleted: null,
              weight: null,
              skipped: true,
              restSeconds,
            });
            setSkippedSets((prev) => [...prev, localCurrentSet]);
            if (isLastSet) {
              onClose();
            } else {
              setLocalCurrentSet((prev) => prev + 1);
              setPhase("active");
              animateIn(20);
            }
          },
        },
      ],
    );
  };

  const handleRestFinished = () => {
    if (isLastSet) {
      onClose();
    } else {
      setLocalCurrentSet((prev) => prev + 1);
      setPhase("active");
      animateIn(20);
    }
  };

  const getSetStatus = (setNum: number): SetStatus => {
    if (skippedSets.includes(setNum)) return "skipped";
    if (doneSets.find((d) => d.setNum === setNum)) return "done";
    if (setNum === localCurrentSet) return "active";
    return "pending";
  };

  const getDoneData = (setNum: number) =>
    doneSets.find((d) => d.setNum === setNum);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[sty.safe, { backgroundColor: colors.bg }]}>
        {/* ── HEADER ── */}
        <View style={sty.header}>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={[
              sty.headerBtn,
              { backgroundColor: "#eeeaea55", borderColor: "#eeeaea75" },
            ]}
          >
            <Ionicons name="close" size={20} color="#eeeaea" />
          </TouchableOpacity>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: 1.2,
                opacity: 0.9,
              }}
            >
              EJERCICIO
            </Text>
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            onPress={() => setConfigVisible(true)}
            activeOpacity={0.7}
            style={[
              sty.headerBtn,
              { backgroundColor: "#eeeaea55", borderColor: "#eeeaea75" },
            ]}
          >
            <Ionicons name="settings-outline" size={20} color="#eeeaea" />
          </TouchableOpacity>
        </View>

        {/* ── PHASE: ACTIVE ── */}
        {phase === "active" && (
          <Animated.View
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <ScrollView
              contentContainerStyle={sty.activeContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* ── CUSTOM EXERCISE HEADER ── Sin padding - toma todo el ancho */}
              <CustomExerciseHeader
                exerciseName={exercise.name}
                formattedTitle={formatTextTitle(
                  selectedExercise ?? exercise.name,
                )}
                primaryColor={colors.primary}
                isDark={isDark}
                containerHeight={200}
              />

              {/* Contenedor con padding para el resto del contenido */}
              <View style={{ paddingHorizontal: 20, gap: 16 }}>
                <View style={sty.steppersRow}>
                  <BigStepper
                    label="Peso"
                    value={weight}
                    unit="kg"
                    step={2.5}
                    min={0}
                    max={500}
                    onChange={handleWeightChange}
                    colors={colors}
                    isDark={isDark}
                    accent={weightAccent}
                    isModified={weight !== (exercise.weight ?? 0)}
                  />
                  <BigStepper
                    label="Reps"
                    value={reps}
                    step={1}
                    min={1}
                    max={99}
                    onChange={handleRepsChange}
                    colors={colors}
                    isDark={isDark}
                    accent={colors.primary}
                    isModified={reps !== (parseInt(exercise.reps, 10) || 10)}
                  />
                </View>

                <View style={sty.histSection}>
                  <Text
                    style={[sty.histTitle, { color: colors.textSecondary }]}
                  >
                    SERIES
                  </Text>
                  <View style={sty.histList}>
                    {Array.from({ length: localTotalSets }).map((_, i) => {
                      const setNum = i + 1;
                      const status = getSetStatus(setNum);
                      const doneData = getDoneData(setNum);
                      return (
                        <SetHistoryRow
                          key={setNum}
                          setNumber={setNum}
                          status={status}
                          reps={status === "active" ? reps : doneData?.reps}
                          weight={
                            status === "active" ? weight : doneData?.weight
                          }
                          restSeconds={
                            status === "active" ? restSeconds : doneData?.rest
                          }
                          colors={colors}
                          isDark={isDark}
                          primary={colors.primary}
                          onEditRest={
                            status === "active"
                              ? () => setRestVisible(true)
                              : undefined
                          }
                        />
                      );
                    })}
                  </View>
                </View>
              </View>
            </ScrollView>

            <View
              style={[
                sty.footer,
                { borderTopColor: isDark ? "#1E1E1E" : "#EFEFEF" },
              ]}
            >
              <PrimaryButton
                label={isLastSet ? "Finalizar" : "Completar"}
                iconLeft={isLastSet ? "trophy" : "checkmark-circle"}
                onPress={handleCompleteSet}
              />
            </View>
          </Animated.View>
        )}

        {/* ── PHASE: RESTING ── */}
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

      {/* ── REST SHEET ── */}
      <Modal
        visible={restVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setRestVisible(false)}
      >
        <SafeAreaView style={[sty.safe, { backgroundColor: colors.bg }]}>
          <View style={sty.sheetHeader}>
            <View style={sty.sheetTitleRow}>
              <Ionicons name="time-outline" size={22} color={restAccent} />
              <Text style={[sty.sheetTitle, { color: colors.textPrimary }]}>
                Descanso · SET {String(localCurrentSet).padStart(2, "0")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setRestVisible(false)}
              style={[
                sty.headerBtn,
                { backgroundColor: "#eeeaea55", borderColor: "#eeeaea75" },
              ]}
            >
              <Ionicons name="close" size={20} color="#eeeaea" />
            </TouchableOpacity>
          </View>

          <View style={sty.restSheetContent}>
            <Text style={[sty.restSheetSub, { color: colors.textSecondary }]}>
              Aplica al descanso después de completar este set.
            </Text>
            <View
              style={[
                sty.restBigValue,
                {
                  backgroundColor: restAccent + "15",
                  borderColor: restAccent + "35",
                },
              ]}
            >
              <Ionicons name="time" size={28} color={restAccent} />
              <Text style={[sty.restBigText, { color: restAccent }]}>
                {formatRest(restSeconds)}
              </Text>
            </View>
            <SmallStepper
              label="Ajustar tiempo"
              value={restSeconds}
              unit="s"
              min={15}
              max={600}
              step={15}
              onChange={handleRestChange}
              colors={colors}
              isDark={isDark}
              accent={restAccent}
            />
            <View style={sty.presetsGrid}>
              {[30, 60, 90, 120, 180, 240].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => handleRestChange(s)}
                  activeOpacity={0.7}
                  style={[
                    sty.presetLarge,
                    restSeconds === s
                      ? { backgroundColor: restAccent, borderColor: restAccent }
                      : {
                          backgroundColor: isDark ? "#1A1A1A" : "#EFEFEF",
                          borderColor: isDark ? "#2A2A2A" : "#E0E0E0",
                        },
                  ]}
                >
                  <Text
                    style={[
                      sty.presetLargeText,
                      {
                        color: restSeconds === s ? "#fff" : colors.textPrimary,
                      },
                    ]}
                  >
                    {formatRestTime(s)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            style={[
              sty.sheetFooter,
              { borderTopColor: isDark ? "#1E1E1E" : "#EFEFEF" },
            ]}
          >
            <PrimaryButton
              label="Listo"
              onPress={() => setRestVisible(false)}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* ── CONFIG SHEET ── */}
      <Modal
        visible={configVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setConfigVisible(false)}
      >
        <SafeAreaView style={[sty.safe, { backgroundColor: colors.bg }]}>
          <View style={sty.sheetHeader}>
            <View style={sty.sheetTitleRow}>
              <Ionicons
                name="settings-outline"
                size={22}
                color={colors.primary}
              />
              <Text style={[sty.sheetTitle, { color: colors.textPrimary }]}>
                Configurar series
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setConfigVisible(false)}
              style={[
                sty.headerBtn,
                { backgroundColor: "#eeeaea55", borderColor: "#eeeaea75" },
              ]}
            >
              <Ionicons name="close" size={20} color="#eeeaea" />
            </TouchableOpacity>
          </View>

          <View style={sty.configContent}>
            <Text style={[sty.restSheetSub, { color: colors.textSecondary }]}>
              Podés ajustar el ejercicio o modificar las series.
            </Text>

            {/* ─── CAMBIO DE EJERCICIO ─── */}
            {doneSets.length === 0 ? (
              <>
                <TouchableOpacity
                  onPress={() => setShowExerciseSelector((prev) => !prev)}
                  activeOpacity={0.7}
                  style={[
                    sty.exerciseSelector,
                    {
                      backgroundColor: isDark ? "#141414" : "#F5F5F5",
                      borderColor: isDark ? "#252525" : "#E5E5E5",
                    },
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        sty.selectorLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      EJERCICIO
                    </Text>
                    <Text
                      style={[sty.selectorValue, { color: colors.textPrimary }]}
                    >
                      {formatTextTitle(exercise.name)}
                    </Text>
                  </View>
                  <Ionicons
                    name={showExerciseSelector ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>

                {showExerciseSelector && (
                  <View
                    style={[
                      sty.exerciseList,
                      {
                        borderColor: isDark ? "#252525" : "#E5E5E5",
                        backgroundColor: isDark ? "#0F0F0F" : "#FAFAFA",
                      },
                    ]}
                  >
                    {loadingExercises ? (
                      <ActivityIndicator
                        style={{ marginVertical: 16 }}
                        color={colors.primary}
                      />
                    ) : exerciseOptions.length === 0 ? (
                      <Text
                        style={[sty.emptyList, { color: colors.textSecondary }]}
                      >
                        No hay ejercicios alternativos disponibles
                      </Text>
                    ) : (
                      <ScrollView
                        style={{ maxHeight: 220 }}
                        nestedScrollEnabled
                      >
                        {exerciseOptions.map((item) => {
                          const isSelected = item.name === selectedExercise;

                          return (
                            <TouchableOpacity
                              key={item.name}
                              onPress={() => {
                                setSelectedExercise(item.name);
                                onReplaceExercise?.(item.name);
                                setShowExerciseSelector(false);
                              }}
                              style={[
                                sty.exerciseItem,
                                {
                                  backgroundColor: isSelected
                                    ? colors.primary + "20"
                                    : "transparent",
                                },
                              ]}
                            >
                              <Text style={{ color: colors.textPrimary }}>
                                {formatTextTitle(item.name)}
                              </Text>

                              {isSelected && (
                                <Ionicons
                                  name="checkmark"
                                  size={16}
                                  color={colors.primary}
                                />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    )}
                  </View>
                )}
              </>
            ) : (
              <View
                style={[
                  sty.modNote,
                  {
                    backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5",
                    borderColor: isDark ? "#2A2A2A" : "#E5E5E5",
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text
                  style={[sty.modNoteText, { color: colors.textSecondary }]}
                >
                  No podés cambiar el ejercicio después de empezar series
                </Text>
              </View>
            )}

            {!loadingExercises && exerciseOptions.length === 0 && (
              <Text style={{ padding: 12, textAlign: "center" }}>
                No hay ejercicios disponibles
              </Text>
            )}

            {showExerciseSelector && (
              <ScrollView style={{ maxHeight: 200 }}>
                {loadingExercises ? (
                  <ActivityIndicator style={{ marginVertical: 12 }} />
                ) : (
                  exerciseOptions.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      onPress={() => {
                        onReplaceExercise?.(item.name);
                        setShowExerciseSelector(false);
                      }}
                      style={sty.exerciseItem}
                    >
                      <Text style={sty.exerciseItemText}>
                        {item.name.replace(/_/g, " ")}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            )}

            {/* ─── SERIES ─── */}
            <SmallStepper
              label="Total de series"
              value={sets}
              min={localCurrentSet}
              max={20}
              step={1}
              onChange={handleSetsChange}
              colors={colors}
              isDark={isDark}
              accent={setsAccent}
            />

            {setsModified && (
              <View
                style={[
                  sty.modNote,
                  {
                    backgroundColor: setsAccent + "15",
                    borderColor: setsAccent + "35",
                  },
                ]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={setsAccent}
                />
                <Text style={[sty.modNoteText, { color: setsAccent }]}>
                  Modificado · plan original: {plannedSets} series
                </Text>
              </View>
            )}
          </View>

          <View
            style={[
              sty.sheetFooter,
              { borderTopColor: isDark ? "#1E1E1E" : "#EFEFEF" },
            ]}
          >
            <PrimaryButton
              label="Listo"
              onPress={() => {
                if (selectedExercise && selectedExercise !== exercise.name) {
                  onReplaceExercise?.(selectedExercise);
                }

                setConfigVisible(false);
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </Modal>
  );
}

const sty = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  activeContent: {
    paddingHorizontal: 0,
    paddingTop: 4,
    paddingBottom: 16,
    gap: 16,
  },

  steppersRow: { flexDirection: "row", gap: 12 },

  histSection: { gap: 8 },
  histTitle: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  histList: { gap: 6 },

  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
    borderTopWidth: 1,
    gap: 10,
  },

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

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 12,
  },
  sheetTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
    borderTopWidth: 1,
  },

  restSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 20,
  },
  restSheetSub: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
  restBigValue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 24,
    borderRadius: 20,
    borderWidth: 1,
  },
  restBigText: { fontSize: 48, fontWeight: "900", letterSpacing: -2 },
  presetsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  presetLarge: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: "30%",
    alignItems: "center",
  },
  presetLargeText: { fontSize: 15, fontWeight: "700" },

  configContent: { flex: 1, paddingHorizontal: 20, paddingTop: 8, gap: 20 },
  modNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },

  exerciseSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  selectorLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  selectorValue: {
    fontSize: 16,
    fontWeight: "800",
  },

  exerciseList: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  exerciseItem: {
    padding: 14,
    borderBottomWidth: 1,
  },

  exerciseItemText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyList: {
    padding: 16,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
  },
  modNoteText: { fontSize: 13, fontWeight: "600", flex: 1 },
});

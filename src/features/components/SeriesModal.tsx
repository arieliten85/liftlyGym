import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { ExerciseProgress, RoutineExercise } from "@/type/routine.type";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { formatRest } from "../onboarding/utils/formatRestTime";

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
  onFinishSet: () => void;
  formatTextTitle: (text: string) => string;
}

function SetDots({
  current,
  total,
  primary,
  isDark,
}: {
  current: number;
  total: number;
  primary: string;
  isDark: boolean;
}) {
  return (
    <View style={sty.dotsRow}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current - 1;
        const active = i === current - 1;
        return (
          <View
            key={i}
            style={[
              sty.dot,
              { backgroundColor: isDark ? "#2A2A2A" : "#E0E0E0" },
              done && { backgroundColor: primary + "70" },
              active && {
                backgroundColor: primary,
                width: 32,
                borderRadius: 6,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function DataChip({
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
    <View style={sty.chip}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={[sty.chipValue, { color: colors.textPrimary }]}>
        {value}
      </Text>
      <Text style={[sty.chipLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

interface CountdownProps {
  seconds: number;
  isLastSet: boolean;
  colors: ThemeColors;
  isDark: boolean;
  primary: string;
  onSkip: () => void;
  onFinish: () => void;
}

function RestCountdown({
  seconds,
  isLastSet,
  colors,
  isDark,
  primary,
  onSkip,
  onFinish,
}: CountdownProps) {
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
  const bgColor = isDark ? "#0D0D0D" : "#F8F8F8";

  return (
    <View style={[sty.countdownFull, { backgroundColor: bgColor }]}>
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
          sty.skipBtn,
          {
            backgroundColor: isDark ? "#1E1E1E" : "#EFEFEF",
            borderColor: isDark ? "#2A2A2A" : "#E0E0E0",
          },
        ]}
      >
        <Text style={[sty.skipText, { color: colors.textSecondary }]}>
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
  onFinishSet,
  formatTextTitle,
}: SeriesModalProps) {
  const [phase, setPhase] = useState<Phase>("active");
  const [localCurrentSet, setLocalCurrentSet] = useState(1);
  const [localTotalSets, setLocalTotalSets] = useState(3);
  const [restSeconds, setRestSeconds] = useState(60);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const animateIn = (fromValue = 40) => {
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
      setPhase("active");
      setLocalCurrentSet(progress.currentSet);
      setLocalTotalSets(progress.totalSets);
      setRestSeconds(progress.editedRestSeconds ?? exercise.restSeconds ?? 60);
      animateIn();
    }
  }, [visible]);

  if (!exercise || !progress) return null;

  const isLastSet = localCurrentSet >= localTotalSets;

  const displayReps = progress.editedReps || exercise.reps;
  const displayWeight = progress.editedWeight ?? 0;
  const displayRest = progress.editedRestSeconds ?? exercise.restSeconds ?? 60;

  const handleCompleteSet = () => {
    onFinishSet();
    setPhase("resting");
  };

  const handleRestFinished = () => {
    if (isLastSet) {
      onClose();
    } else {
      setLocalCurrentSet((prev) => prev + 1);
      setPhase("active");
      animateIn(30);
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

          <View style={[sty.seriesPill, { backgroundColor: colors.primary }]}>
            <Text style={sty.seriesPillText}>
              SERIE {localCurrentSet} / {localTotalSets}
            </Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {phase === "active" && (
          <Animated.View
            style={[
              sty.activeContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
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
              <Text style={[sty.motivation, { color: colors.textSecondary }]}>
                {isLastSet
                  ? "¡Último set! Dalo todo 🔥"
                  : "Completá la serie y descansá"}
              </Text>
            </View>

            {/* Set dots */}
            <SetDots
              current={localCurrentSet}
              total={localTotalSets}
              primary={colors.primary}
              isDark={isDark}
            />

            <View
              style={[
                sty.dataRow,
                {
                  backgroundColor: isDark ? "#141414" : "#F5F5F5",
                  borderColor: isDark ? "#252525" : "#E8E8E8",
                },
              ]}
            >
              <DataChip
                icon="repeat"
                label="reps"
                value={displayReps}
                color={colors.primary}
                colors={colors}
              />
              <View
                style={[sty.dataDivider, { backgroundColor: colors.border }]}
              />
              <DataChip
                icon="barbell-outline"
                label="peso"
                value={displayWeight === 0 ? "—" : `${displayWeight}kg`}
                color={isDark ? "#F59E0B" : "#D97706"}
                colors={colors}
              />
              <View
                style={[sty.dataDivider, { backgroundColor: colors.border }]}
              />
              <DataChip
                icon="time-outline"
                label="descanso"
                value={formatRest(displayRest)}
                color={isDark ? "#34D399" : "#059669"}
                colors={colors}
              />
            </View>

            <View style={{ flex: 1 }} />

            <View
              style={[
                sty.footer,
                { borderTopColor: isDark ? "#1E1E1E" : "#EFEFEF" },
              ]}
            >
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
  seriesPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
  },
  seriesPillText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  // Active phase
  activeContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 20,
  },

  nameBlock: { gap: 6 },
  exerciseName: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  motivation: { fontSize: 15, fontWeight: "500" },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },

  // Data chips
  dataRow: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  chip: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  chipValue: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dataDivider: { width: 1, height: 44 },

  footer: {
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
    borderTopWidth: 1,
  },

  // Countdown
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
  skipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  skipText: { fontSize: 14, fontWeight: "600" },
});

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ImageSection } from "@/features/build-routine/components/ImageSection";
import { Badge } from "@/shared/components/Badge";

interface CustomHeaderRoutineProps {
  routineName: string;
  goal: string;
  elapsedMinutes?: number;
  elapsedSeconds?: number;
  estimatedMinutes?: number;
  completedExercises?: number;
  totalExercises?: number;
  primaryColor?: string;
  containerHeight?: number;
}

const GOAL_BADGE_TEXT: Record<string, string> = {
  strength: "STRENGTH",
  hypertrophy: "HYPERTROPHY",
  weight_loss: "WEIGHT LOSS",
  endurance: "ENDURANCE",
  general_fitness: "FITNESS",
};

export function CustomHeaderRoutine({
  routineName,
  goal,
  elapsedMinutes = 0,
  elapsedSeconds = 0,
  estimatedMinutes = 0,
  completedExercises = 0,
  totalExercises = 0,
  primaryColor = "#22C55E",
  containerHeight = 320,
}: CustomHeaderRoutineProps) {
  const goalText = GOAL_BADGE_TEXT[goal] ?? goal.toUpperCase();

  // Formatea el tiempo transcurrido en formato MM:SS
  const formatElapsedTime = () => {
    const totalSeconds = elapsedMinutes * 60 + elapsedSeconds;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {/* Imagen de fondo */}
      <View style={styles.imageWrapper}>
        <ImageSection coverColor="#1A1A1A" routineName={routineName} />
      </View>

      {/* Gradiente overlay */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.2)",
          "rgba(0,0,0,0.5)",
          "rgba(0,0,0,0.75)",
        ]}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.gradientOverlay}
      />

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Badge de objetivo arriba a la derecha */}

        {/* Título de la rutina */}

        {/* Stats: Badge de tiempo total y Badge de tiempo transcurrido */}
        <View style={styles.statsRow}>
          {/* Badge de tiempo total */}
          <View style={styles.badgeWrapper}>
            <Badge label={goalText} color={primaryColor} />
            <Badge label={`${estimatedMinutes} MINS`} color="#eeeaea" subtle />
          </View>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.routineName}>{routineName} DAY</Text>

          <View style={styles.timeCard}>
            <Text style={styles.timeCardLabel}>
              {elapsedMinutes > 0 ? "TRANSCURRIDO" : "ESTIMADO"}
            </Text>
            <Text style={styles.timeCardValue}>
              {elapsedMinutes > 0
                ? formatElapsedTime()
                : `${estimatedMinutes} MINS`}
            </Text>
          </View>
        </View>

        {/* Descripción genérica */}
        <Text style={styles.description}>
          Enfócate en la técnica y en la conexión mente-músculo. Mantén la
          intensidad y disfruta el proceso.{" "}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: 20,
  },
  imageWrapper: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    zIndex: 2,
  },
  routineName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    zIndex: 2,
    textTransform: "uppercase",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    zIndex: 2,
  },
  badgeWrapper: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    color: "#A0A0A0",
    zIndex: 2,
  },

  timeCard: {
    backgroundColor: "rgba(17, 17, 17, 0.84)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,

    alignItems: "center",
    minWidth: 100,
  },

  timeCardLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timeCardValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
});

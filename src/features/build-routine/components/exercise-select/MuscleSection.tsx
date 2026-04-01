import { StyleSheet, Text, View } from "react-native";
import { ExerciseCard } from "./ExerciseCard";

import { token } from "@/theme/token";
import { MUSCLE_LABELS } from "../../constants/muscleLabels";

export function MuscleSection({
  muscle,
  exercises,
  selectedExercises,
  actions,
  colors,
}: any) {
  return (
    <View style={styles.section}>
      <View style={[styles.header, { borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.teal }]}>
          {MUSCLE_LABELS[muscle] ?? muscle.toUpperCase()}
        </Text>

        <Text style={[styles.count, { color: colors.sub }]}>
          {
            exercises.filter((ex: any) =>
              selectedExercises.some((s: any) => s.id === ex.id),
            ).length
          }{" "}
          / {exercises.length}
        </Text>
      </View>

      {exercises.map((exercise: any) => {
        const saved = selectedExercises.find((e: any) => e.id === exercise.id);

        return (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            selectedData={saved}
            onPress={() => actions.handleCardPress(exercise)}
            onEdit={() => actions.openEdit(exercise, saved)}
            onRemove={() => actions.handleRemove(exercise.id)}
            colors={colors}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: token.spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: token.spacing.sm,
    borderBottomWidth: 1,
    paddingBottom: token.spacing.xs,
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
  },
  count: {
    fontSize: 12,
  },
});

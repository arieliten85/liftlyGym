import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function ExerciseCard({
  exercise,
  selectedData,
  onPress,
  onEdit,
  onRemove,
  colors,
}: any) {
  const selected = !!selectedData;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: selected
            ? colors.isDark
              ? "#091714"
              : "#EBF9F7"
            : colors.card,
          borderColor: selected ? colors.teal : colors.border,
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.cardTouch}>
        <View>
          <Text style={[styles.cardName, { color: colors.text }]}>
            {exercise.name}
          </Text>

          {selectedData && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryText, { color: colors.teal }]}>
                {selectedData.sets}x{selectedData.reps}
              </Text>

              <TouchableOpacity onPress={onEdit}>
                <Text style={[styles.editText, { color: colors.sub }]}>
                  editar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={selected ? onRemove : onPress}
        style={styles.icon}
      >
        <Ionicons
          name={selected ? "close-circle" : "add-circle-outline"}
          size={24}
          color={selected ? "#ff6b6b" : colors.sub}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: token.radius.md,
    borderWidth: 1,
    marginBottom: token.spacing.sm,
    overflow: "hidden",
  },
  cardTouch: {
    flex: 1,
    padding: token.spacing.md,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "600",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: "500",
  },
  editText: {
    fontSize: 12,
    textDecorationLine: "underline",
  },
  icon: {
    paddingHorizontal: token.spacing.md,
    paddingVertical: token.spacing.md,
  },
});

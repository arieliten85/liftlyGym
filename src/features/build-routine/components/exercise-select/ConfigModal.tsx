import { token } from "@/theme/token";
import { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export function ConfigModal({
  visible,
  exercise,
  initial,
  onConfirm,
  onCancel,
  colors,
}: any) {
  const [sets, setSets] = useState(initial.sets);
  const [reps, setReps] = useState(initial.reps);
  const [rest, setRest] = useState(initial.rest);

  useEffect(() => {
    if (visible) {
      setSets(initial.sets);
      setReps(initial.reps);
      setRest(initial.rest);
    }
  }, [visible]);

  if (!exercise) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {exercise.name}
          </Text>

          <View style={styles.row}>
            <TextInput
              value={sets}
              onChangeText={setSets}
              style={styles.input}
              placeholder="Sets"
            />
            <TextInput
              value={reps}
              onChangeText={setReps}
              style={styles.input}
              placeholder="Reps"
            />
            <TextInput
              value={rest}
              onChangeText={setRest}
              style={styles.input}
              placeholder="Rest"
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel}>
              <Text>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onConfirm(sets, reps, rest)}>
              <Text style={{ color: colors.teal }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    padding: token.spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: token.spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: token.spacing.lg,
  },
});

// features/routine/ReplaceExerciseModal.tsx
import { ExerciseOption, ExerciseService } from "@/services/exerciseService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const exerciseService = new ExerciseService();

interface Props {
  visible: boolean;
  muscle: string; // músculo del ejercicio a reemplazar
  currentName: string; // ejercicio actual para excluirlo de la lista
  onSelect: (newName: string) => void;
  onClose: () => void;
}

const EQUIPMENT_LABEL: Record<string, string> = {
  gym: "🏋️ Gym",
  mancuernas: "🥊 Mancuernas",
  peso_corporal: "💪 Peso corporal",
  bandas: "🔴 Bandas",
};

export function ReplaceExerciseModal({
  visible,
  muscle,
  currentName,
  onSelect,
  onClose,
}: Props) {
  const [exercises, setExercises] = useState<ExerciseOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !muscle) return;
    setLoading(true);
    exerciseService
      .getByMuscle(muscle)
      .then((data) => setExercises(data.filter((e) => e.name !== currentName)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [visible, muscle, currentName]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable style={s.sheet}>
          {/* Header */}
          <View style={s.header}>
            <View>
              <Text style={s.title}>Cambiar ejercicio</Text>
              <Text style={s.subtitle}>
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Lista */}
          {loading ? (
            <ActivityIndicator style={{ marginVertical: 32 }} color="#339c92" />
          ) : (
            <FlatList
              data={exercises}
              keyExtractor={(item) => item.name}
              style={s.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={s.item}
                  onPress={() => onSelect(item.name)}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={s.itemName}>
                      {item.name.replace(/_/g, " ")}
                    </Text>
                    <Text style={s.itemEquip}>
                      {item.equipment
                        .map((e) => EQUIPMENT_LABEL[e] ?? e)
                        .join("  ")}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color="#ccc"
                  />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={s.empty}>No hay ejercicios disponibles</Text>
              }
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 13, color: "#339c92", fontWeight: "600", marginTop: 2 },
  list: { flexShrink: 1 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    textTransform: "capitalize",
    marginBottom: 3,
  },
  itemEquip: { fontSize: 12, color: "#888" },
  empty: { textAlign: "center", padding: 24, color: "#999" },
});

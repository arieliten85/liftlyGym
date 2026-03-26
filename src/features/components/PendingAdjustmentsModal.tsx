import { PendingAdjustment } from "@/services/notificationService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  routineName: string;
  adjustments: PendingAdjustment[];
  onApply: () => void;
  onIgnore: () => void;
}

function AdjustmentRow({ adj }: { adj: PendingAdjustment }) {
  const prev = adj.previous;
  const name = adj.name.replace(/_/g, " ");
  const changes: string[] = [];

  if (
    adj.weight !== undefined &&
    prev?.weight !== undefined &&
    prev.weight !== null &&
    Math.abs(adj.weight - prev.weight) >= 0.1
  ) {
    const dir = adj.weight > prev.weight ? "↑" : "↓";
    changes.push(`${dir} peso: ${prev.weight}kg → ${adj.weight}kg`);
  }

  if (adj.reps !== undefined && adj.reps !== prev?.reps) {
    const parseMin = (r: string) => parseInt(r.split("-")[0], 10) || 0;
    const dir = parseMin(adj.reps) > parseMin(prev?.reps ?? "0") ? "↑" : "↓";
    changes.push(`${dir} reps: ${prev?.reps} → ${adj.reps}`);
  }

  if (adj.sets !== undefined && adj.sets !== prev?.sets) {
    const dir = adj.sets > (prev?.sets ?? 0) ? "↑" : "↓";
    changes.push(`${dir} series: ${prev?.sets} → ${adj.sets}`);
  }

  if (adj.restSeconds !== undefined && adj.restSeconds !== prev?.restSeconds) {
    const dir = adj.restSeconds > (prev?.restSeconds ?? 0) ? "↑" : "↓";
    changes.push(
      `${dir} descanso: ${prev?.restSeconds}s → ${adj.restSeconds}s`,
    );
  }

  if (changes.length === 0) return null;

  return (
    <View style={row.container}>
      <Text style={row.name}>{name}</Text>
      {changes.map((c, i) => {
        const isUp = c.startsWith("↑");
        return (
          <View key={i} style={row.changeRow}>
            <View
              style={[
                row.pill,
                { backgroundColor: isUp ? "#16A34A20" : "#DC262620" },
              ]}
            >
              <Text
                style={[row.pillText, { color: isUp ? "#16A34A" : "#DC2626" }]}
              >
                {c}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const row = StyleSheet.create({
  container: {
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    textTransform: "capitalize",
    marginBottom: 2,
  },
  changeRow: { flexDirection: "row" },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  pillText: { fontSize: 13, fontWeight: "600" },
});

export function PendingAdjustmentsModal({
  visible,
  routineName,
  adjustments,
  onApply,
  onIgnore,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onIgnore}
    >
      <Pressable style={s.backdrop} onPress={onIgnore}>
        <Pressable style={s.card}>
          {/* Header */}
          <View style={s.header}>
            <View style={s.iconWrap}>
              <MaterialCommunityIcons
                name="robot-outline"
                size={22}
                color="#339c92"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>La IA ajustó tu rutina</Text>
              <Text style={s.subtitle} numberOfLines={1}>
                {routineName}
              </Text>
            </View>
          </View>

          {/* Lista de cambios */}
          <ScrollView
            style={s.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {adjustments.map((adj, i) => (
              <AdjustmentRow key={i} adj={adj} />
            ))}
          </ScrollView>

          {/* Botones */}
          <View style={s.footer}>
            <TouchableOpacity
              style={s.btnIgnore}
              onPress={onIgnore}
              activeOpacity={0.7}
            >
              <Text style={s.btnIgnoreText}>Ignorar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.btnApply}
              onPress={onApply}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={18}
                color="#fff"
              />
              <Text style={s.btnApplyText}>Aplicar cambios</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#339c9215",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 13, color: "#666", marginTop: 1 },
  list: { paddingHorizontal: 20, maxHeight: 300 },
  footer: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  btnIgnore: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  btnIgnoreText: { fontSize: 14, fontWeight: "700", color: "#666" },
  btnApply: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#339c92",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnApplyText: { fontSize: 14, fontWeight: "800", color: "#fff" },
});

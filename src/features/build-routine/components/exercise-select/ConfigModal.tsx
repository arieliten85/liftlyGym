import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const FIELDS = [
  { key: "sets", label: "Series", icon: "layers-outline" },
  { key: "reps", label: "Reps", icon: "repeat-outline" },
] as const;

export function ConfigModal({
  visible,
  exercise,
  initial,
  onConfirm,
  onCancel,
}: any) {
  const { theme, isDark } = useAppTheme();

  const [sets, setSets] = useState(initial.sets);
  const [reps, setReps] = useState(initial.reps);
  const [restMin, setRestMin] = useState(() =>
    String(Math.floor(initial.rest / 60)),
  );
  const [restSec, setRestSec] = useState(() => String(initial.rest % 60));

  const values = { sets, reps };
  const setters = { sets: setSets, reps: setReps };

  useEffect(() => {
    if (visible) {
      setSets(initial.sets);
      setReps(initial.reps);
      setRestMin(String(Math.floor(initial.rest / 60)));
      setRestSec(String(initial.rest % 60));
    }
  }, [visible]);

  if (!exercise) return null;

  const inputBg = isDark ? "#16191F" : "#F0F2F5";
  const inputBorder = isDark ? "#2A2E36" : "#DDE1E8";
  const cancelBg = isDark ? "#1C1F26" : "#EAEDF2";
  const accentGlow = theme.primary + (isDark ? "25" : "18");

  const handleConfirm = () => {
    const totalSeconds =
      (parseInt(restMin) || 0) * 60 + (parseInt(restSec) || 0);
    onConfirm(sets, reps, totalSeconds);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? "#13161C" : "#FFFFFF" },
          ]}
        >
          {/* Handle */}
          <View
            style={[
              styles.handle,
              { backgroundColor: isDark ? "#2A2E36" : "#DDE1E8" },
            ]}
          />

          {/* Título */}
          <View style={styles.titleRow}>
            <View
              style={[styles.titleIconWrap, { backgroundColor: accentGlow }]}
            >
              <Ionicons
                name="barbell-outline"
                size={18}
                color={theme.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.titleSub, { color: theme.primary }]}>
                CONFIGURAR
              </Text>
              <Text
                style={[styles.title, { color: theme.text }]}
                numberOfLines={1}
              >
                {exercise.name}
              </Text>
            </View>
          </View>

          {/* Sets + Reps */}
          <View style={styles.row}>
            {FIELDS.map(({ key, label, icon }) => (
              <View
                key={key}
                style={[
                  styles.inputWrapper,
                  { backgroundColor: inputBg, borderColor: inputBorder },
                ]}
              >
                <Ionicons
                  name={icon as any}
                  size={14}
                  color={theme.primary}
                  style={{ opacity: 0.8 }}
                />
                <Text
                  style={[styles.inputLabel, { color: theme.textSecondary }]}
                >
                  {label}
                </Text>
                <TextInput
                  value={values[key]}
                  onChangeText={setters[key]}
                  style={[styles.input, { color: theme.text }]}
                  keyboardType="numeric"
                  placeholderTextColor={theme.textSecondary}
                  selectionColor={theme.primary}
                />
              </View>
            ))}
          </View>

          {/* Descanso */}
          <View
            style={[
              styles.restSection,
              { backgroundColor: inputBg, borderColor: inputBorder },
            ]}
          >
            <View style={styles.restHeader}>
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.primary}
                style={{ opacity: 0.8 }}
              />
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Descanso entre series
              </Text>
            </View>

            <View style={styles.restRow}>
              <View style={styles.restInputGroup}>
                <TextInput
                  value={restMin}
                  onChangeText={setRestMin}
                  style={[
                    styles.restInput,
                    { color: theme.text, borderColor: theme.primary + "60" },
                  ]}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholderTextColor={theme.textSecondary}
                  selectionColor={theme.primary}
                  placeholder="0"
                />
                <Text style={[styles.restUnit, { color: theme.textSecondary }]}>
                  min
                </Text>
              </View>

              <Text
                style={[styles.restSeparator, { color: theme.textSecondary }]}
              >
                :
              </Text>

              <View style={styles.restInputGroup}>
                <TextInput
                  value={restSec}
                  onChangeText={(v) => {
                    const n = parseInt(v) || 0;
                    setRestSec(n > 59 ? "59" : v);
                  }}
                  style={[
                    styles.restInput,
                    { color: theme.text, borderColor: theme.primary + "60" },
                  ]}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholderTextColor={theme.textSecondary}
                  selectionColor={theme.primary}
                  placeholder="0"
                />
                <Text style={[styles.restUnit, { color: theme.textSecondary }]}>
                  seg
                </Text>
              </View>
            </View>
          </View>

          {/* Acciones */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.7}
              style={[styles.btn, { backgroundColor: cancelBg }]}
            >
              <Text style={[styles.btnText, { color: theme.textSecondary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.8}
              style={[
                styles.btn,
                styles.btnPrimary,
                { backgroundColor: theme.primary },
              ]}
            >
              <Ionicons name="checkmark" size={18} color={theme.onPrimary} />
              <Text style={[styles.btnText, { color: theme.onPrimary }]}>
                Guardar
              </Text>
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
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    paddingHorizontal: token.spacing.lg,
    paddingTop: token.spacing.md,
    paddingBottom: token.spacing.xl,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: token.spacing.lg,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: token.radius.round,
    alignSelf: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: token.spacing.sm,
  },
  titleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: token.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  titleSub: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    fontSize: token.typography.body,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  row: {
    flexDirection: "row",
    gap: token.spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderRadius: token.radius.md,
    paddingVertical: token.spacing.sm,
    paddingHorizontal: token.spacing.xs,
    alignItems: "center",
    gap: 4,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    fontSize: token.typography.h3,
    fontWeight: "900",
    textAlign: "center",
    width: "100%",
    letterSpacing: -0.5,
  },
  restSection: {
    borderWidth: 1,
    borderRadius: token.radius.md,
    paddingVertical: token.spacing.sm,
    paddingHorizontal: token.spacing.md,
    gap: token.spacing.sm,
  },
  restHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  restRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: token.spacing.md,
  },
  restInputGroup: {
    alignItems: "center",
    gap: 4,
  },
  restInput: {
    fontSize: token.typography.h2,
    fontWeight: "900",
    textAlign: "center",
    width: 80,
    borderBottomWidth: 2,
    paddingBottom: 4,
    letterSpacing: -1,
  },
  restUnit: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  restSeparator: {
    fontSize: token.typography.h2,
    fontWeight: "900",
    marginTop: -16,
  },
  actions: {
    flexDirection: "row",
    gap: token.spacing.sm,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 15,
    borderRadius: token.radius.md,
  },
  btnPrimary: {
    borderWidth: 0,
  },
  btnText: {
    fontSize: token.typography.body,
    fontWeight: "700",
  },
});

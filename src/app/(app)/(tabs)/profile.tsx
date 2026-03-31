import { useUserStore } from "@/features/auth/store/userStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── MenuRow ──────────────────────────────────────────────────────────────────

interface MenuRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
  accentColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  destructive?: boolean;
  showChevron?: boolean;
}

function MenuRow({
  icon,
  label,
  value,
  onPress,
  accentColor,
  textColor,
  bgColor,
  borderColor,
  destructive = false,
  showChevron = true,
}: MenuRowProps) {
  const color = destructive ? "#EF4444" : accentColor;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.72}
      style={[r.row, { backgroundColor: bgColor, borderColor }]}
    >
      <View style={[r.rowIcon, { backgroundColor: color + "14" }]}>
        <MaterialCommunityIcons name={icon as any} size={18} color={color} />
      </View>
      <Text
        style={[r.rowLabel, { color: destructive ? "#EF4444" : textColor }]}
      >
        {label}
      </Text>
      {value && (
        <Text style={[r.rowValue, { color: accentColor }]}>{value}</Text>
      )}
      {showChevron && !destructive && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={18}
          color={borderColor}
        />
      )}
    </TouchableOpacity>
  );
}

// ─── PerfilScreen ─────────────────────────────────────────────────────────────

export default function PerfilScreen() {
  const { theme: c, isDark } = useAppTheme();

  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const bg = isDark ? "#070B12" : c.background;
  const cardBg = isDark ? "#0E1219" : c.card;
  const subColor = isDark ? "#4A5568" : c.textSecondary;
  const borderCol = isDark ? "#141922" : c.border;
  const TEAL = c.primary;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que querés cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(onboarding)");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Título ── */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <Text style={[s.title, { color: c.text }]}>Perfil</Text>
        </Animated.View>

        {/* ── Tarjeta usuario ── */}
        <Animated.View
          style={[
            s.profileCard,
            { backgroundColor: cardBg, borderColor: borderCol },
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View
            style={[
              s.avatar,
              { backgroundColor: TEAL + "18", borderColor: TEAL + "30" },
            ]}
          >
            <Text style={[s.avatarText, { color: TEAL }]}>{initials}</Text>
          </View>

          <View style={s.profileInfo}>
            <Text style={[s.profileName, { color: c.text }]} numberOfLines={1}>
              {user?.name ?? "—"}
            </Text>
            <Text
              style={[s.profileEmail, { color: subColor }]}
              numberOfLines={1}
            >
              {user?.email ?? "—"}
            </Text>
          </View>

          <View
            style={[
              s.activeBadge,
              { backgroundColor: TEAL + "14", borderColor: TEAL + "28" },
            ]}
          >
            <View style={[s.activeDot, { backgroundColor: TEAL }]} />
            <Text style={[s.activeBadgeText, { color: TEAL }]}>Activo</Text>
          </View>
        </Animated.View>

        {/* ── Cuenta ── */}
        <Animated.View style={[s.section, { opacity: fadeAnim }]}>
          <Text style={[s.sectionLabel, { color: subColor }]}>CUENTA</Text>
          <View style={[s.group, { borderColor: borderCol }]}>
            <MenuRow
              icon="account-edit-outline"
              label="Editar perfil"
              onPress={() => {}}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
            />
            <View style={[s.separator, { backgroundColor: borderCol }]} />
            <MenuRow
              icon="lock-outline"
              label="Cambiar contraseña"
              onPress={() => {}}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
            />
          </View>
        </Animated.View>

        {/* ── Preferencias ── */}
        <Animated.View style={[s.section, { opacity: fadeAnim }]}>
          <Text style={[s.sectionLabel, { color: subColor }]}>
            PREFERENCIAS
          </Text>
          <View style={[s.group, { borderColor: borderCol }]}>
            <MenuRow
              icon="theme-light-dark"
              label="Apariencia"
              onPress={() => {}}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
            />
            <View style={[s.separator, { backgroundColor: borderCol }]} />
            <MenuRow
              icon="bell-outline"
              label="Notificaciones"
              onPress={() => {}}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
            />
            <View style={[s.separator, { backgroundColor: borderCol }]} />
            <MenuRow
              icon="help-circle-outline"
              label="Ayuda y soporte"
              onPress={() => {}}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
            />
          </View>
        </Animated.View>

        {/* ── Cerrar sesión ── */}
        <Animated.View style={[s.section, { opacity: fadeAnim }]}>
          <View style={[s.group, { borderColor: borderCol }]}>
            <MenuRow
              icon="logout"
              label="Cerrar sesión"
              onPress={handleLogout}
              accentColor={TEAL}
              textColor={c.text}
              bgColor={cardBg}
              borderColor={borderCol}
              destructive
              showChevron={false}
            />
          </View>
        </Animated.View>

        <Text style={[s.version, { color: isDark ? "#1A2030" : "#D8E0EC" }]}>
          Liftly v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 22, gap: 20, paddingBottom: 48 },

  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.8,
    lineHeight: 32,
    paddingTop: 4,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  avatarText: { fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  profileEmail: { fontSize: 12, fontWeight: "500" },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9,
    borderWidth: 1,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  activeBadgeText: { fontSize: 11, fontWeight: "700" },

  section: { gap: 10 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    paddingLeft: 2,
  },
  group: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  separator: { height: 1, marginLeft: 52 },

  version: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
});

const r = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "600" },
  rowValue: { fontSize: 13, fontWeight: "600" },
});

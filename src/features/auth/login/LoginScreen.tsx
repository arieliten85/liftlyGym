import { LiftlyIcon } from "@/shared/components/BrandIcon";
import { useThemeStore } from "@/store/themes/themeStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";

import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { LoginForm } from "@/types/auth/auth";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { AuthInput } from "../components/Authinput";
import { AuthService } from "../service/auth.service";
import { useUserStore } from "../store/userStore";

// CAMBIO: recibe onSuccess como prop.
// La ruta (app/(onboarding)/(auth)/login.tsx) decide a dónde ir después.
// LoginScreen ya no sabe nada de rutas ni de stores de build-routine.
type Props = {
  onSuccess: () => void;
};

export default function LoginScreen({ onSuccess }: Props) {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const c = theme;

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  const setSession = useUserStore((s) => s.setSession);
  const authService = new AuthService();

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 480,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const makeFade = (anim: Animated.Value, offsetY = 24) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [offsetY, 0],
        }),
      },
    ],
  });

  const bg = isDark ? "#070B12" : c.background;
  const TEAL = c.primary;

  const handleLogin = async () => {
    try {
      const result = await authService.login({
        email: form.email,
        password: form.password,
      });

      const token = result.token;
      const decoded: any = jwtDecode(token);

      const user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      };

      // CAMBIO: se eliminó el AsyncStorage.setItem duplicado.
      // setSession ya persiste el token internamente (ver userStore.ts).
      await setSession(user, token);

      Toast.show({
        type: "success",
        text1: "Ingreso exitoso",
        text2: `Bienvenido, ${user.name}!`,
        position: "top",
        visibilityTime: 2000,
      });

      // CAMBIO: antes era router.replace("/(tabs)/rutinas")
      // Ahora delega la navegación a quien instancia esta pantalla.
      onSuccess();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error al iniciar sesión",
        text2: "Correo o contraseña incorrectos",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  return (
    <View style={[styles.safe, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.brand, makeFade(logoAnim, 32)]}>
            <LiftlyIcon size={52} />
            <Text style={[styles.brandName, { color: c.text }]}>Liftly</Text>
            <Text style={[styles.brandTagline, { color: c.textSecondary }]}>
              Tu entrenamiento, optimizado por IA
            </Text>
          </Animated.View>

          <Animated.View style={[styles.formBlock, makeFade(formAnim)]}>
            <Text style={[styles.formTitle, { color: c.text }]}>
              Iniciar sesión
            </Text>

            <View style={styles.inputs}>
              <AuthInput
                label="Correo electrónico"
                icon="mail"
                value={form.email}
                onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
                keyboardType="email-address"
                colors={c}
                isDark={isDark}
              />
              <AuthInput
                label="Contraseña"
                icon="lock"
                value={form.password}
                onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
                isPassword
                colors={c}
                isDark={isDark}
              />
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.footerContainer}>
          <PrimaryButton
            label="Entrar"
            onPress={handleLogin}
            disabled={!form.email || !form.password}
          />
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: c.textSecondary }]}>
              ¿No tenés cuenta?
            </Text>
            {/* CAMBIO: ruta actualizada a la nueva estructura */}
            <Pressable
              onPress={() => router.push("/(onboarding)/(auth)/register")}
            >
              <Text style={[styles.footerLink, { color: TEAL }]}>
                Registrate
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.topBar}>
          {router.canGoBack() && (
            <TouchableOpacity
              // CAMBIO: antes iba a "/" (que era OnboardingScreen en el root).
              // Ahora va al grupo correcto.
              onPress={() => router.replace("/(onboarding)")}
              activeOpacity={0.7}
              style={styles.iconBtn}
            >
              <Feather name="arrow-left" size={20} color={TEAL} />
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            style={styles.iconBtn}
          >
            <Feather name={isDark ? "sun" : "moon"} size={20} color={TEAL} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 32,
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "android" ? 12 : 44,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    zIndex: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { alignItems: "center", gap: 10, marginBottom: 32 },
  brandName: { fontSize: 36, fontWeight: "800" },
  brandTagline: { fontSize: 14 },
  formBlock: { gap: 24 },
  formTitle: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  inputs: { gap: 8 },
  footerContainer: {
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === "android" ? 20 : 32,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: "700" },
});

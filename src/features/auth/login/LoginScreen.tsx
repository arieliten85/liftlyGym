import { LiftlyIcon } from "@/shared/components/BrandIcon";
import { useThemeStore } from "@/store/themes/themeStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";

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
import { LoginForm } from "../types/Auth.types";

export default function LoginScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const c = theme.colors;

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 380,
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

      await AsyncStorage.setItem("token", token);

      setSession(user, token);

      // Toast de éxito
      Toast.show({
        type: "success",
        text1: "Ingreso exitoso",
        text2: `Bienvenido, ${user.name}!`,
        position: "top",
        visibilityTime: 2000,
      });

      router.push("../goals");
    } catch (error) {
      console.log(error);

      // Toast de error
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
    <View style={[s.safe, { backgroundColor: bg }]}>
      <View style={s.topBar}>
        <TouchableOpacity
          onPress={toggleTheme}
          activeOpacity={0.7}
          style={s.themeBtn}
        >
          <Feather name={isDark ? "sun" : "moon"} size={20} color={TEAL} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[s.brand, makeFade(logoAnim, 32)]}>
            <LiftlyIcon size={52} />
            <Text style={[s.brandName, { color: c.text }]}>Liftly</Text>
            <Text style={[s.brandTagline, { color: c.textSecondary }]}>
              Tu entrenamiento, optimizado por IA
            </Text>
          </Animated.View>

          <Animated.View style={[s.formBlock, makeFade(formAnim)]}>
            <Text style={[s.formTitle, { color: c.text }]}>Iniciar sesión</Text>

            <View style={s.inputs}>
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

            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.88}
              style={[s.cta, { backgroundColor: TEAL }]}
            >
              <Text style={s.ctaText}>Entrar</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[s.footer, makeFade(footerAnim, 16)]}>
            <Text style={[s.footerText, { color: c.textSecondary }]}>
              ¿No tenés cuenta?
            </Text>

            <Pressable onPress={() => router.push("/register")}>
              <Text style={[s.footerLink, { color: TEAL }]}>Registrate</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },

  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  themeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 32,
    justifyContent: "center",
    gap: 40,
  },

  brand: { alignItems: "center", gap: 10 },

  brandName: { fontSize: 36, fontWeight: "800" },

  brandTagline: { fontSize: 14 },

  formBlock: { gap: 24 },

  formTitle: { fontSize: 22, fontWeight: "800" },

  inputs: { gap: 8 },

  cta: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 17,
    borderRadius: 16,
  },

  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

  footerText: { fontSize: 14 },

  footerLink: { fontSize: 14, fontWeight: "700" },
});

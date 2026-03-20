import { LiftlyIcon } from "@/shared/components/BrandIcon";
import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { useThemeStore } from "@/store/themes/themeStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { RegisterPayload } from "@/types/auth/auth";
import { AuthInput } from "../components/Authinput";
import { registerSchema, RegisterSchema } from "../schemas/auth.schema";
import { AuthService } from "../service/auth.service";

export default function RegisterScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const c = theme;

  const [loading, setLoading] = useState(false);
  const authService = new AuthService();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 460,
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

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setLoading(true);
      const payload: RegisterPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      await authService.register(payload);

      Toast.show({ type: "success", text1: "Cuenta creada exitosamente" });
      router.push("../goals");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al registrarse",
        text2: "Intenta nuevamente",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.safe, { backgroundColor: bg }]}>
      {/* Top bar overlay */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={toggleTheme}
          activeOpacity={0.7}
          style={styles.iconBtn}
        >
          <Feather name={isDark ? "sun" : "moon"} size={18} color={TEAL} />
        </TouchableOpacity>
      </View>

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
          <Animated.View style={[styles.header, makeFade(headerAnim, 28)]}>
            <View style={styles.logoRow}>
              <LiftlyIcon size={36} />
              <Text style={[styles.logoName, { color: c.text }]}>Liftly</Text>
            </View>

            <Text style={[styles.title, { color: c.text }]}>Crear cuenta</Text>
            <Text style={[styles.subtitle, { color: c.textSecondary }]}>
              Empezá tu camino hacia un entrenamiento más inteligente
            </Text>
          </Animated.View>

          <Animated.View style={[styles.formBlock, makeFade(formAnim)]}>
            <View style={styles.inputs}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="Nombre completo"
                    icon="user"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    colors={c}
                    isDark={isDark}
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="Correo electrónico"
                    icon="mail"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    colors={c}
                    isDark={isDark}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="Contraseña"
                    icon="lock"
                    value={value}
                    onChangeText={onChange}
                    isPassword
                    colors={c}
                    isDark={isDark}
                    error={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="Confirmar contraseña"
                    icon="shield"
                    value={value}
                    onChangeText={onChange}
                    isPassword
                    colors={c}
                    isDark={isDark}
                    error={errors.confirmPassword?.message}
                  />
                )}
              />
            </View>
          </Animated.View>
        </ScrollView>

        {/* Footer fijo abajo */}
        <View style={styles.footerContainer}>
          <PrimaryButton
            label="Crear cuenta"
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          />
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: c.textSecondary }]}>
              ¿Ya tenés cuenta?
            </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text style={[styles.footerLink, { color: TEAL }]}>
                Iniciá sesión
              </Text>
            </Pressable>
          </View>
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
    paddingTop: 80, // ↓ Baja el logo
    paddingBottom: 32,
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "android" ? 12 : 44,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    zIndex: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  header: { gap: 10, marginBottom: 24 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoName: { fontSize: 22, fontWeight: "800" },
  title: { fontSize: 28, fontWeight: "900" },
  subtitle: { fontSize: 14 },
  formBlock: { gap: 20 },
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

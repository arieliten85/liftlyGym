import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { useThemeStore } from "@/store/themes/themeStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { useRouter } from "expo-router";

import { LiftlyIcon } from "@/shared/components/BrandIcon";
import { Feather } from "@expo/vector-icons";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ParticleBackground } from "../components/ParticleBackground";
import { ImageSlider } from "../components/slider/ImageSlider";

const { width, height } = Dimensions.get("window");

const isSmallDevice = height < 680;
const isMediumDevice = height >= 680 && height < 780;
const isTablet = width > 600;

const scale = (size: number) => {
  if (isSmallDevice) return size * 0.82;
  if (isMediumDevice) return size * 0.92;
  if (isTablet) return size * 1.1;
  return size;
};

const vSpacing = (size: number) => {
  const factor = height / 812;
  return Math.max(size * factor, isSmallDevice ? size * 0.55 : size * 0.7);
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const bg = isDark ? "#070B12" : theme.background;
  const glowAlpha = isDark ? "rgba(46,207,190,0.055)" : "rgba(46,207,190,0.08)";
  const TEAL = theme.primary;
  const brandColor = theme.text;
  const loginColor = theme.text;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ParticleBackground isDark={isDark} glowAlpha={glowAlpha} />
      <Animated.View style={[styles.header, isTablet && styles.headerTablet]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 0 }}>
          <LiftlyIcon size={32} />
          <Text style={[styles.brandText, { color: brandColor }]}>Liftly</Text>
        </View>
        <TouchableOpacity
          onPress={toggleTheme}
          style={styles.themeBtn}
          activeOpacity={0.7}
        >
          <Feather
            name={isDark ? "sun" : "moon"}
            size={scale(22)}
            color={TEAL}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={styles.loginBtn}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.loginText,
              {
                color: loginColor,
                fontSize: scale(15),
              },
            ]}
          >
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <Animated.View style={{ marginBottom: vSpacing(16) }}>
          <ImageSlider isDark={isDark} TEAL={TEAL} />
        </Animated.View>
      </ScrollView>

      <Animated.View style={[styles.ctaWrapper]}>
        <PrimaryButton
          label="Empezar"
          onPress={() =>
            router.push("/(onboarding)/(build-routine)/goals?from=onboarding")
          }
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? token.spacing.lg : token.spacing.lg,
    paddingBottom: 8,
    minHeight: 52,
    zIndex: 10,
  },
  headerTablet: {
    paddingHorizontal: 40,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  themeBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
  },
  loginText: { fontWeight: "600" },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 16,
    flexGrow: 1,
  },
  brandText: {
    fontWeight: "600",
    color: "white",
    paddingHorizontal: 5,
    fontSize: 25,
  },
  ctaWrapper: {
    paddingHorizontal: isTablet ? 40 : 20,
    paddingBottom:
      Platform.OS === "ios"
        ? isSmallDevice
          ? 14
          : 20
        : isSmallDevice
          ? 10
          : 16,
    paddingTop: isSmallDevice ? 8 : 12,
  },
});

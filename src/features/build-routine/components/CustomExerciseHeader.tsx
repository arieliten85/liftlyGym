import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExerciseGif } from "../../auth/hooks/useExerciseGif";
import { ImageExercise } from "./ImageExercise";

interface CustomExerciseHeaderProps {
  exerciseName: string;
  formattedTitle: string;
  primaryColor?: string;
  isDark?: boolean;
  containerHeight?: number;
}

export function CustomExerciseHeader({
  exerciseName,
  formattedTitle,
  primaryColor = "#0066FF",
  isDark = true,
  containerHeight = 240,
}: CustomExerciseHeaderProps) {
  const [gifVisible, setGifVisible] = useState(false);
  const [ratio, setRatio] = useState(1);

  const { gifUrl, loading: gifLoading } = useExerciseGif(exerciseName);

  const colors = {
    bg: isDark ? "#000000" : "#FFFFFF",
    textPrimary: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#A0A0A0" : "#666666",
  };

  return (
    <>
      <View style={[styles.banner, { height: containerHeight }]}>
        {/* Imagen de fondo */}
        <View style={styles.bannerImageWrapper}>
          <ImageExercise routineName={exerciseName} coverColor="#1A1A1A" />
        </View>

        {/* Gradiente overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
          locations={[0, 0.5, 1]}
          style={styles.bannerGradient}
        />

        {/* Contenido */}
        <View style={styles.bannerContent}>
          {/* Título del ejercicio */}
          <Text
            style={styles.bannerTitle}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {formattedTitle}
          </Text>

          {/* Botón Ver Ejercicio */}
          <TouchableOpacity
            onPress={() => setGifVisible(true)}
            activeOpacity={0.7}
            style={[
              styles.verEjercicioBtn,
              {
                backgroundColor: primaryColor + "20",
                borderColor: primaryColor + "40",
              },
            ]}
          >
            <Ionicons name="eye-outline" size={18} color={primaryColor} />
            <Text style={[styles.verEjercicioText, { color: primaryColor }]}>
              Ver ejercicio
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── GIF MODAL ── */}
      <Modal
        visible={gifVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setGifVisible(false)}
      >
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleRow}>
              <Text
                style={[styles.sheetTitle, { color: colors.textPrimary }]}
                numberOfLines={2}
              >
                {formattedTitle}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setGifVisible(false)}
              style={[
                styles.headerBtn,
                { backgroundColor: "#eeeaea55", borderColor: "#eeeaea75" },
              ]}
            >
              <Ionicons name="close" size={20} color="#eeeaea" />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.gifContainer,
              { backgroundColor: isDark ? "#111" : "#F0F0F0" },
            ]}
          >
            {gifLoading ? (
              <ActivityIndicator size="large" color={primaryColor} />
            ) : gifUrl ? (
              <Image
                source={{ uri: gifUrl }}
                style={{ width: "100%", aspectRatio: ratio, borderRadius: 12 }}
                resizeMode="contain"
                onLoad={(e) => {
                  const { width, height } = e.nativeEvent.source;
                  setRatio(width / height);
                }}
              />
            ) : (
              <Text style={[styles.noGifText, { color: colors.textSecondary }]}>
                No hay video disponible
              </Text>
            )}
          </View>

          <Text style={[styles.gifTip, { color: colors.textSecondary }]}>
            Observá la técnica y el rango de movimiento antes de comenzar.
          </Text>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  bannerImageWrapper: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  bannerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
    paddingBottom: 16,
    gap: 12,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  verEjercicioBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    alignSelf: "flex-start",
  },
  verEjercicioText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Modal styles
  safe: { flex: 1 },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 12,
  },
  sheetTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  gifContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  noGifText: {
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 40,
  },
  gifTip: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 32,
    paddingTop: 16,
    lineHeight: 20,
  },
});

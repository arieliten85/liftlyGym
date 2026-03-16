import { useLoadingStore } from "@/store/loading/loadingStore";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export function GlobalLoader() {
  const loading = useLoadingStore((s) => s.loading);

  if (!loading) return null;

  return (
    <View style={s.overlay}>
      <ActivityIndicator size="large" color="#00BFA6" />
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
});

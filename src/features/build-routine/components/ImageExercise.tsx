import { Image, StyleSheet, View } from "react-native";
import { EXECISE_IMAGES } from "../constants/routine-images.constants";

interface ImageExerciseProps {
  routineName?: string;
  coverColor?: string;
}

export function ImageExercise({
  routineName,
  coverColor = "#1A1A1A",
}: ImageExerciseProps) {
  const imageSource = EXECISE_IMAGES[routineName ?? "press_banca"];

  return (
    <View style={[styles.container, { backgroundColor: coverColor }]}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
});

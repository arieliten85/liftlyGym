import { Image, StyleSheet, View } from "react-native";
import { EXECISE_IMAGES } from "../constants/routine-images.constants";

interface ImageSectionProps {
  routineName?: string;
  coverColor?: string;
  expColor?: string;
  expLabel?: string;
}

export function ImageExieciseCard({
  routineName,
  coverColor,
}: ImageSectionProps) {
  const imageSource = EXECISE_IMAGES[routineName ?? "fullbody"];

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

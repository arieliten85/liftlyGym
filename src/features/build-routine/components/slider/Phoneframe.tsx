import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

interface PhoneFrameProps {
  image: ImageSourcePropType;
  width: number;
  height: number;
  borderRadius: number;
  borderColor: string;
  backgroundColor: string;
  shadowColor: string;
  isDark: boolean;
}

export function PhoneFrame({
  image,
  width,
  height,
  borderRadius,
  borderColor,
  backgroundColor,
  shadowColor,
  isDark,
}: PhoneFrameProps) {
  const notchBg = isDark ? "#070B12" : "#E8F0EF";
  const notchPillBg = isDark ? "#1C2A28" : "#CDD8D6";

  return (
    <View
      style={[
        styles.phoneFrame,
        {
          width,
          height,
          borderRadius,
          borderColor,
          backgroundColor,
          shadowColor,
        },
      ]}
    >
      {/* Notch */}
      <View style={[styles.frameNotch, { backgroundColor: notchBg }]}>
        <View
          style={[styles.frameNotchPill, { backgroundColor: notchPillBg }]}
        />
      </View>

      {/* Screenshot */}
      <Image
        source={image}
        style={[
          styles.phoneImage,
          {
            borderBottomLeftRadius: width * 0.12,
            borderBottomRightRadius: width * 0.12,
          },
        ]}
        resizeMode="cover"
      />

      {/* Bottom bar */}
      <View style={[styles.frameBottomBar, { backgroundColor: notchBg }]}>
        <View
          style={[
            styles.frameHomePill,
            { backgroundColor: "#2ECFBE", opacity: 0.4 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phoneFrame: {
    borderWidth: 1.5,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  frameNotch: {
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  frameNotchPill: {
    width: 40,
    height: 5,
    borderRadius: 3,
    opacity: 0.6,
  },
  phoneImage: {
    width: "100%",
    flex: 1,
  },
  frameBottomBar: {
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  frameHomePill: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
});

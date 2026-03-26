// shared/components/MuscleSelectionCard.tsx
import { ROUTINE_IMAGES } from "@/features/build-routine/constants/routine-images.constants";
import { DaySessionType } from "@/features/build-routine/type/routine-builder.types";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MuscleSelectionCardProps {
  type: DaySessionType;
  title: string;
  subtitle?: string;
  image?: any;
  icon?: string;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
  isDark: boolean;
  teal: string;
  borderDef: string;
  theme: any;
  cardWidth: number;
}

export function MuscleSelectionCard({
  type,
  title,
  subtitle,
  image,
  icon,
  isSelected,
  isDisabled,
  onPress,
  isDark,
  teal,
  borderDef,
  theme,
  cardWidth,
}: MuscleSelectionCardProps) {
  const finalImage =
    image ?? ROUTINE_IMAGES[type as keyof typeof ROUTINE_IMAGES];
  const borderSel = isDark ? "rgba(46,207,190,0.6)" : teal;
  const cardBg = isDark ? "#0C1119" : theme.card;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isDisabled ? 1 : 0.8}
      disabled={isDisabled}
      style={[
        styles.card,
        {
          width: cardWidth,
          borderColor: isSelected ? borderSel : borderDef,
          backgroundColor: cardBg,
          opacity: isDisabled ? 0.3 : 1,
          shadowColor: isSelected ? teal : "transparent",
        },
      ]}
    >
      {isSelected && (
        <View style={[styles.topLine, { backgroundColor: teal }]} />
      )}

      <View style={styles.imageContainer}>
        {finalImage ? (
          <Image source={finalImage} style={styles.image} resizeMode="cover" />
        ) : (
          <View
            style={[
              styles.imageFallback,
              {
                backgroundColor: isDark
                  ? "rgba(46,207,190,0.08)"
                  : "rgba(46,207,190,0.06)",
              },
            ]}
          >
            {icon && (
              <Ionicons
                name={icon as any}
                size={24}
                color={
                  isSelected ? teal : isDark ? "#4A6A66" : theme.textSecondary
                }
              />
            )}
          </View>
        )}

        <View
          style={[
            styles.imageOverlay,
            {
              backgroundColor: isSelected
                ? isDark
                  ? "rgba(2,20,18,0.38)"
                  : "rgba(0,80,70,0.22)"
                : isDark
                  ? "rgba(0,0,0,0.45)"
                  : "rgba(0,0,0,0.28)",
            },
          ]}
        />

        {isSelected && (
          <View style={[styles.checkBadge, { backgroundColor: teal }]}>
            <Ionicons name="checkmark" size={10} color="#fff" />
          </View>
        )}

        {isDisabled && !isSelected && (
          <View style={styles.disabledBadge}>
            <Ionicons name="close" size={10} color="#fff" />
          </View>
        )}
      </View>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: isSelected
              ? isDark
                ? "#091714"
                : "#EBF9F7"
              : cardBg,
            borderTopColor: isSelected
              ? isDark
                ? "rgba(46,207,190,0.25)"
                : "rgba(46,207,190,0.35)"
              : isDark
                ? "rgba(255,255,255,0.05)"
                : theme.border,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: isSelected ? teal : isDark ? "#DFF0EE" : theme.text },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            numberOfLines={1}
            style={[
              styles.subtitle,
              {
                color: isDark
                  ? isSelected
                    ? "#B8D4D0"
                    : "#4A6A66"
                  : theme.textSecondary,
              },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  topLine: {
    height: 2,
    width: "70%",
    alignSelf: "center",
    opacity: 0.7,
    borderRadius: 1,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    backgroundColor: "#111",
  },
  image: { width: "100%", height: "100%" },
  imageFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: { ...StyleSheet.absoluteFillObject },
  checkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(150,50,50,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 2,
  },
  title: { fontSize: 13, fontWeight: "700", letterSpacing: 0.2 },
  subtitle: { fontSize: 10, lineHeight: 14 },
});

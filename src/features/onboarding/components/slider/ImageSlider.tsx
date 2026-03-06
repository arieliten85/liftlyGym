import { SLIDES } from "@/features/onboarding/constants/onboarding.constants";
import { typography } from "@/theme/token";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { PhoneFrame } from "./Phoneframe";

export interface SlideImage {
  uri: string;
  // o si usas require:
  // image: any;
}

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  images: ImageSourcePropType[];
}

const { width } = Dimensions.get("window");

const { height } = Dimensions.get("window");
const isSmallDevice = height < 680;
const isMediumDevice = height >= 680 && height < 780;
const isTablet = width > 600;

const scale = (size: number) => {
  if (isSmallDevice) return size * 0.82;
  if (isMediumDevice) return size * 0.92;
  if (isTablet) return size * 1.1;
  return size;
};

interface ImageSliderProps {
  isDark: boolean;
  TEAL: string;
}

export function ImageSlider({ isDark, TEAL }: ImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (activeIndex + 1) % SLIDES.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  // ── Theme-derived colors ──
  const phoneBorder = isDark ? "rgba(46,207,190,0.28)" : "rgba(46,207,190,0.4)";
  const titleColor = isDark ? "#DFF0EE" : "#1A2E2B";
  const subtitleColor = isDark
    ? "rgba(200,220,218,0.65)"
    : "rgba(50,75,72,0.7)";
  const dotInactive = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";

  const PHONE_W = width * 0.41;
  const PHONE_H = PHONE_W * 2.08;

  const currentSlide = SLIDES[activeIndex];

  return (
    <View style={styles.sliderContainer}>
      {/* Fixed-height text header — prevents layout jump between slides */}
      <View style={styles.slideHeader}>
        <Text
          style={[
            styles.slideTitle,
            { color: titleColor, fontSize: scale(typography.h1) },
          ]}
          numberOfLines={3}
        >
          {currentSlide.title}
        </Text>
        <Text
          style={[
            styles.slideSubtitle,
            { color: subtitleColor, fontSize: scale(typography.body) },
          ]}
        >
          {currentSlide.subtitle}
        </Text>
      </View>

      {/* Full-width FlatList so pagingEnabled works correctly */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        style={{ width }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.phonesRow}>
              {item.images.map((img: ImageSourcePropType, idx: number) => (
                <PhoneFrame
                  key={idx}
                  image={img}
                  width={PHONE_W}
                  height={PHONE_H}
                  borderRadius={PHONE_W * 0.13}
                  borderColor={phoneBorder}
                  backgroundColor={isDark ? "#0A1018" : "#F4F8F7"}
                  shadowColor={TEAL}
                  isDark={isDark}
                />
              ))}
            </View>
          </View>
        )}
      />

      {/* Pagination dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index: i, animated: true });
              setActiveIndex(i);
            }}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeIndex ? TEAL : dotInactive,
                  width: i === activeIndex ? 22 : 6,
                  opacity: i === activeIndex ? 1 : 0.5,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: "center",
  },
  slideHeader: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 28,
    marginBottom: 20,
    gap: 10,
    justifyContent: "center",
  },
  slideTitle: {
    fontWeight: "800",
    width: "100%",
    textAlign: "left",
    minHeight: 50,
  },
  slideSubtitle: {
    fontWeight: "400",
    textAlign: "left",
    letterSpacing: 0.1,
    minHeight: 52,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
  },
  phonesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 18,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});

import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function useOnboardingAnimation() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(90, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 480,
        useNativeDriver: true,
      }),
      Animated.spring(bottomAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { fadeAnim, bottomAnim };
}

import { DesignTokens, Shadows } from "./types";

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  h1: 32,
  h2: 28,
  h3: 22,
  body: 16,
  title: 20,
  bodySmall: 14,
  button: 18,
  caption: 12,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 30,
  round: 999,
} as const;

export const shadows: Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
};

export const token: DesignTokens = {
  spacing,
  typography,
  radius,
  shadows,
};

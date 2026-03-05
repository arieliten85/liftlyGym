import { ColorScheme, ColorTheme } from "./types";

const lightColors: ColorScheme = {
  background: "#F8F9FB",
  surface: "#FFFFFF",
  primary: "#2ECFBE", // teal vibrante — igual al músculo resaltado
  secondary: "#1A9E90", // teal más oscuro para contraste
  text: "#1C1C1E",
  textSecondary: "#6C6C70",
  border: "#E5E7EB",
  card: "#FFFFFF",
  onPrimary: "#FFFFFF",
};

const darkColors: ColorScheme = {
  background: "#0F1115",
  surface: "#1C1F26",
  primary: "#2ECFBE", // mismo teal — mantiene identidad en dark
  secondary: "#1A9E90",
  text: "#F2F2F7",
  textSecondary: "#A1A1AA",
  border: "#2A2E36",
  card: "#1C1F26",
  onPrimary: "#FFFFFF",
};

export const lightTheme: ColorTheme = {
  colors: lightColors,
};

export const darkTheme: ColorTheme = {
  colors: darkColors,
};

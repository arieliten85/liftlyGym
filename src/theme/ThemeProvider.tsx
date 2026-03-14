import { useThemeStore } from "@/store/themes/themeStore";
import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

import { darkTheme, lightTheme } from "./themes";
import { ColorTheme } from "./types";

type ThemeContextType = {
  theme: ColorTheme;
  mode: "light" | "dark";
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((state) => state.mode);

  const finalMode = mode === "system" ? systemScheme : mode;
  const resolvedMode = finalMode === "dark" ? "dark" : "light";

  const theme = resolvedMode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode: resolvedMode,
        isDark: resolvedMode === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeProvider missing");
  return context;
};

export interface ColorScheme {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  onPrimary: string;
}

export interface ColorTheme {
  colors: ColorScheme;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface Typography {
  h1: number;
  h2: number;
  h3: number;
  body: number;
  title: number;
  bodySmall: number;
  button: number;
  caption: number;
}

export interface Radius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  round: number;
}

export interface Shadows {
  sm: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

export interface DesignTokens {
  spacing: Spacing;
  typography: Typography;
  radius: Radius;
  shadows: Shadows;
}

export type ThemeContextType = {
  theme: ColorTheme;
  isDark: boolean;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};
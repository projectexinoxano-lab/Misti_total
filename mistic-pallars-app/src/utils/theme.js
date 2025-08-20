// Tema i estils de l'aplicació Mistic Pallars
// Data: 2025-08-13

export const colors = {
  // Colors principals inspirats en el Pallars
  primary: {
    50: '#f0f9f4',
    100: '#dcf2e3',
    200: '#bce5cb',
    300: '#8dd2a8',
    400: '#57b87f',
    500: '#349f5f', // Color principal
    600: '#26804c',
    700: '#20653e',
    800: '#1c5134',
    900: '#18432c',
  },
  secondary: {
    50: '#f7f4f0',
    100: '#ede5d9',
    200: '#dbc9b4',
    300: '#c3a786',
    400: '#b08a63',
    500: '#9d7248', // Marró terra
    600: '#85603c',
    700: '#6e4f33',
    800: '#5a412d',
    900: '#4b3628',
  },
  accent: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Blau cel
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  earth: {
    50: '#fefaf6',
    100: '#fcf3ea',
    200: '#f7e5d1',
    300: '#f0d0ac',
    400: '#e6b583',
    500: '#dc9a5a', // Ocre
    600: '#c8823e',
    700: '#a86b35',
    800: '#875731',
    900: '#6e482b',
  },
  // Colors del sistema
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Colors d'estat
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
};

export default theme;
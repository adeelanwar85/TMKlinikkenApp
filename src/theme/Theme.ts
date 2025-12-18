
export const Colors = {
  primary: {
    main: '#A44E52', // Corrected burgundy from user input
    dark: '#7A3639', // Darker shade of user's color
    deep: '#502022', // Deep shade of user's color
    light: '#F5E6E7',
  },
  neutral: {
    white: '#FFFFFF',
    cream: '#F5F5F0',
    lightGray: '#E8E8E8',
    darkGray: '#3A3A3A',
    charcoal: '#2D2D2D',
  },
  background: {
    main: '#F8F8F5',
    card: '#FFFFFF',
  },
  status: {
    success: '#7A9B8E',
    error: '#FF6B6B',
    warning: '#FFD93D',
  },
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  fontFamily: {
    heading: 'System', // Will replace with Ubuntu later when fonts are loaded
    body: 'System',    // Will replace with Poppins later
  },
  size: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    small: 14,
    caption: 12,
  },
  weight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
};

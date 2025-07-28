import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2C3E50',
    accent: '#3498DB',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#2C3E50',
    error: '#E74C3C',
    success: '#27AE60',
    warning: '#F39C12',
    info: '#3498DB',
    disabled: '#BDC3C7',
    placeholder: '#95A5A6',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#E74C3C',
    income: '#27AE60',
    expense: '#E74C3C',
  },
  roundness: 8,
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
};
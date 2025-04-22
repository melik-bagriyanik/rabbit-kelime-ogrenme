import { create } from 'zustand';
import { theme } from '../constants/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof theme.light;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  colors: theme.light,
  toggleTheme: () =>
    set((state) => ({
      mode: state.mode === 'light' ? 'dark' : 'light',
      colors: state.mode === 'light' ? theme.dark : theme.light,
    })),
})); 